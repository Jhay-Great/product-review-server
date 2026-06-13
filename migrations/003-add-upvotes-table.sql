CREATE TABLE IF NOT EXISTS feedback_upvotes (
    user_id INTEGER NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    feedback_id INTEGER NOT NULL REFERENCES feedback(id) ON DELETE CASCADE,
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    PRIMARY KEY (user_id, feedback_id)
);
