import pool from "../../config/database";

export const addComment = async function(feedbackId: string, content: string) {
    const { rows } = await pool.query(
        'INSERT INTO comments (content, feedback_id) VALUES ($1, $2) RETURNING *',
        [content, feedbackId]
    );

    return rows;
};

export const getFeedbackComments = async function(feedbackId: string) {
    const { rows } = await pool.query(
        'SELECT * FROM comments WHERE feedback_id = $1',
        [feedbackId]
    );

    return rows;
}
