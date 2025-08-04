import pool from "../../config/db.pgConfig";

export const addComment = async function(feedbackId:string, comment: any) {
    const { rows } = await pool.query(
        'INSERT INTO comment (comment, feedbackId) VALUES ($1, $2) RETURNING *',
        [comment, feedbackId]
    );

    return rows;
};

export const getFeedbackComments = async function(feedbackId:string) {
    const { rows } = await pool.query(
        'SELECT * FROM comments WHERE feedbackId = $1',
        [feedbackId]
    );

    return rows;
}