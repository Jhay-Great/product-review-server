import pool from "../../config/database";
import { CreateFeedback, UpdateFeedback } from "../../types/models";
import { ConflictError, NotFoundError } from "../../utils/errors/httpErrors";

export const createFeeback = async function(data: CreateFeedback, userId: string) {
    const { title, category, description } = data;
    const { rows } = await pool.query(
        `INSERT INTO feedback (title, category, description, user_id) VALUES ($1, $2, $3, $4) RETURNING *`,
        [title, category, description, userId]
    );
    return rows;
}

export const getAllFeedbacks = async function(page: number = 1, limit: number = 10) {
    const offset = (page - 1) * limit;
    const data = await pool.query(
        `SELECT * FROM feedback ORDER BY created_at DESC LIMIT $1 OFFSET $2`,
        [limit, offset]
    );
    return data.rows;
}

export const getFeedbackById = async function(id: string) {
    const response = await pool.query(`SELECT * FROM feedback WHERE id = $1`, [id]);
    return response.rows;
}

export const editFeedback = async function(id: string, userId: string, data: UpdateFeedback) {
    const { title, category, description, status } = data;
    const { rows } = await pool.query(
        'UPDATE feedback SET title = $1, category = $2, description = $3, status = $4 WHERE id = $5 AND user_id = $6 RETURNING *',
        [title, category, description, status, id, userId]
    );
    return rows;
}

export const upvoteFeedback = async function(feedbackId: string, userId: string) {
    const client = await pool.connect();
    try {
        await client.query('BEGIN');

        // Insert into junction table — PRIMARY KEY constraint prevents duplicate votes
        const { rowCount } = await client.query(
            'INSERT INTO feedback_upvotes (user_id, feedback_id) VALUES ($1, $2) ON CONFLICT DO NOTHING',
            [userId, feedbackId]
        );

        if (rowCount === 0) {
            await client.query('ROLLBACK');
            throw new ConflictError('You have already upvoted this feedback');
        }

        const { rows } = await client.query(
            'UPDATE feedback SET upvotes = upvotes + 1 WHERE id = $1 RETURNING upvotes',
            [feedbackId]
        );

        if (rows.length === 0) {
            await client.query('ROLLBACK');
            throw new NotFoundError('Feedback not found');
        }

        await client.query('COMMIT');
        return rows[0];
    } catch (error) {
        await client.query('ROLLBACK');
        throw error;
    } finally {
        client.release();
    }
};

export const deleteFeedback = async function(id: string, userId: string) {
    const { rowCount } = await pool.query(
        'DELETE FROM feedback WHERE id = $1 AND user_id = $2',
        [id, userId]
    );
    return rowCount;
}
