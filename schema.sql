-- Schéma SQL pour le système de matching du Love Hôtel

-- Table des utilisateurs
CREATE TABLE users
(
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    email VARCHAR(255) UNIQUE NOT NULL,
    password_hash VARCHAR(255) NULL,
    name VARCHAR(255) NOT NULL,
    role VARCHAR(50) DEFAULT 'user' NOT NULL,
    avatar VARCHAR(255) NULL,
    onboarding_completed BOOLEAN DEFAULT FALSE NULL,
    email_verified BOOLEAN DEFAULT FALSE NULL,
    -- Renamed from is_verified and made nullable
    is_banned BOOLEAN DEFAULT FALSE NULL,
    -- Made nullable
    status TEXT DEFAULT 'active' NULL,
    -- Made nullable
    email_verification_token VARCHAR(255) NULL,
    created_at TIMESTAMPTZ DEFAULT CURRENT_TIMESTAMP NULL,
    -- Made nullable
    updated_at TIMESTAMPTZ DEFAULT CURRENT_TIMESTAMP NULL
    -- Made nullable
);

-- Table des profils utilisateurs
CREATE TABLE user_profiles
(
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    user_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    status VARCHAR(50) NULL,
    -- 'couple', 'single_male', 'single_female'
    age INTEGER NULL,
    -- Explicitly NULL
    orientation VARCHAR(50) NULL,
    -- Explicitly NULL
    bio TEXT NULL,
    -- Explicitly NULL
    location VARCHAR(255) NULL,
    -- Explicitly NULL
    gender VARCHAR(50) NULL,
    -- Explicitly NULL
    birthday DATE NULL,
    -- Explicitly NULL
    interests TEXT NULL,
    -- Explicitly NULL, Storing as JSON string
    featured BOOLEAN DEFAULT FALSE NULL,
    -- Added column
    created_at TIMESTAMPTZ DEFAULT CURRENT_TIMESTAMP NULL,
    -- Explicitly NULL
    updated_at TIMESTAMPTZ DEFAULT CURRENT_TIMESTAMP NULL
    -- Explicitly NULL
);

-- Table des préférences utilisateurs
CREATE TABLE user_preferences
(
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    user_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    interested_in_restaurant BOOLEAN DEFAULT FALSE,
    interested_in_events BOOLEAN DEFAULT FALSE,
    interested_in_dating BOOLEAN DEFAULT FALSE,
    prefer_curtain_open BOOLEAN DEFAULT FALSE,
    interested_in_lolib BOOLEAN DEFAULT FALSE,
    suggestions TEXT,
    created_at TIMESTAMPTZ DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMPTZ DEFAULT CURRENT_TIMESTAMP
);

-- Table des types de rencontres recherchées
CREATE TABLE user_meeting_types
(
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    user_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    friendly BOOLEAN DEFAULT FALSE,
    romantic BOOLEAN DEFAULT FALSE,
    playful BOOLEAN DEFAULT FALSE,
    open_curtains BOOLEAN DEFAULT FALSE,
    libertine BOOLEAN DEFAULT FALSE,
    open_to_other_couples BOOLEAN DEFAULT FALSE,
    specific_preferences TEXT,
    created_at TIMESTAMPTZ DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMPTZ DEFAULT CURRENT_TIMESTAMP
);

-- Table des options supplémentaires
CREATE TABLE user_additional_options
(
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    user_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    join_exclusive_events BOOLEAN DEFAULT FALSE,
    premium_access BOOLEAN DEFAULT FALSE,
    created_at TIMESTAMPTZ DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMPTZ DEFAULT CURRENT_TIMESTAMP
);

-- Table des matchs entre utilisateurs
CREATE TABLE user_matches
(
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    user_id_1 UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    user_id_2 UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    match_score DECIMAL(5,2),
    -- Score de compatibilité entre 0 et 100
    status VARCHAR(50) DEFAULT 'pending',
    -- 'pending', 'accepted', 'rejected'
    created_at TIMESTAMPTZ DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMPTZ DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT unique_match UNIQUE (user_id_1, user_id_2)
);

-- Table des conversations
CREATE TABLE conversations
(
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    created_at TIMESTAMPTZ DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMPTZ DEFAULT CURRENT_TIMESTAMP
);

-- Table des participants aux conversations
CREATE TABLE conversation_participants
(
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    conversation_id UUID NOT NULL REFERENCES conversations(id) ON DELETE CASCADE,
    user_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    created_at TIMESTAMPTZ DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT unique_participant UNIQUE (conversation_id, user_id)
);

-- Table des messages
CREATE TABLE messages
(
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    conversation_id UUID NOT NULL REFERENCES conversations(id) ON DELETE CASCADE,
    sender_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    content TEXT NOT NULL,
    is_read BOOLEAN DEFAULT FALSE,
    -- Renamed from 'read'
    created_at TIMESTAMPTZ DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMPTZ DEFAULT CURRENT_TIMESTAMP
);

-- Index pour améliorer les performances
CREATE INDEX idx_user_profiles_user_id ON user_profiles(user_id);
CREATE INDEX idx_user_preferences_user_id ON user_preferences(user_id);
CREATE INDEX idx_user_meeting_types_user_id ON user_meeting_types(user_id);
CREATE INDEX idx_user_additional_options_user_id ON user_additional_options(user_id);
CREATE INDEX idx_user_matches_user_id_1 ON user_matches(user_id_1);
CREATE INDEX idx_user_matches_user_id_2 ON user_matches(user_id_2);
CREATE INDEX idx_conversation_participants_conversation_id ON conversation_participants(conversation_id);
CREATE INDEX idx_conversation_participants_user_id ON conversation_participants(user_id);
CREATE INDEX idx_messages_conversation_id ON messages(conversation_id);
CREATE INDEX idx_messages_sender_id ON messages(sender_id);
