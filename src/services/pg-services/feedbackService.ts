import pool from "../../config/db.pgConfig";
import { CreateFeedback } from "../../models/product.interface";

const FEEDBACK_DB = 'feedback';

export const createFeeback = async function(data: CreateFeedback) {
    const { title, category, description } = data;
    const { rows } = await pool.query(
        `INSERT INTO feedback (title, category, description) VALUES ($1, $2, $3) RETURNING *`, 
        [title, category, description]
    );
    console.log('rows: ', rows);
    return rows;
}
export const getAllFeedbacks = async function() {
    const data =  await pool.query(`SELECT * FROM feedback`);
    return data.rows;
}

export const getFeedbackById = async function(id: string) {
    const response = await pool.query(`SELECT * FROM ${FEEDBACK_DB} WHERE id = $1`, [id]);
    return response.rows;
}

export const editFeedback = async function(id: string, data:any) {
    const { title, category, description, status } = data;
    const { rows } = await pool.query(
        'UPDATE feedback SET title = $1, category = $2, description = $3, status = $4 WHERE id = $5 RETURNING *',
        [title, category, description, status, id]
    );
    return rows;
}

export const upvoteFeedback = async function(id: string) {
    const { rows } = await pool.query(
        'UPDATE feedback SET upvotes = upvotes + 1 WHERE id = $1 RETURNING upvotes',
        [id]
    );
    
    if (rows.length === 0) {
        throw new Error(`No feedback found with id: ${id}`);
    }
    return rows[0]
}

export const deleteFeedback = async function(id: string) {
    return await pool.query(`DELETE FROM feedback WHERE id = $1`, [id]);
}

// COMMENTS
export const getAllComments = async function() {};

export const addComment = async function() {};

export const deleteComment = async function() {};