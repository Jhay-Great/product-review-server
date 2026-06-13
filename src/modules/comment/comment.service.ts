import pool from '../../config/database';

export const addComment = async function (feedbackId: string, content: string, userId: string) {
    const { rows } = await pool.query(
        'INSERT INTO comments (content, feedback_id, user_id) VALUES ($1, $2, $3) RETURNING *',
        [content, feedbackId, userId]
    );

    return rows;
};

export const getFeedbackComments = async function (feedbackId: string) {
    const { rows } = await pool.query('SELECT * FROM comments WHERE feedback_id = $1', [
        feedbackId,
    ]);

    return rows;
};

export const deleteComment = async function (commentId: string, userId: string) {
    const { rowCount } = await pool.query('DELETE FROM comments WHERE id = $1 AND user_id = $2', [
        commentId,
        userId,
    ]);
    return rowCount;
};
