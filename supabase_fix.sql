-- ============================================
-- FIX SCRIPT FOR SUPABASE MIGRATION
-- ============================================
-- Run this if you got the "sender_id does not exist" or "table already exists" error
-- This fixes the circular dependency issue and handles existing tables
-- ============================================

-- Step 1: Drop foreign key constraint if it exists (to avoid errors)
DO $$
BEGIN
  IF EXISTS (
    SELECT 1 FROM information_schema.table_constraints 
    WHERE constraint_name = 'conversations_last_message_id_fkey'
    AND table_name = 'conversations'
  ) THEN
    ALTER TABLE conversations DROP CONSTRAINT conversations_last_message_id_fkey;
  END IF;
END $$;

-- Step 2: Drop conversations table if it exists (CASCADE will handle dependencies)
DROP TABLE IF EXISTS conversations CASCADE;

-- Step 3: Check if messages table exists, if not create it first
DO $$
BEGIN
  IF NOT EXISTS (SELECT 1 FROM information_schema.tables WHERE table_schema = 'public' AND table_name = 'messages') THEN
    CREATE TABLE messages (
      id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
      conversation_id UUID NOT NULL, -- Will add foreign key after conversations is created
      sender_id UUID NOT NULL REFERENCES profiles(id) ON DELETE CASCADE,
      receiver_id UUID NOT NULL REFERENCES profiles(id) ON DELETE CASCADE,
      
      content TEXT NOT NULL,
      message_type TEXT DEFAULT 'text' CHECK (message_type IN ('text', 'image', 'file', 'offer', 'application')),
      
      offer_id UUID REFERENCES offers(id) ON DELETE SET NULL,
      application_id UUID REFERENCES applications(id) ON DELETE SET NULL,
      
      is_read BOOLEAN DEFAULT FALSE,
      read_at TIMESTAMP WITH TIME ZONE,
      
      created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
    );

    CREATE INDEX idx_messages_sender_id ON messages(sender_id);
    CREATE INDEX idx_messages_receiver_id ON messages(receiver_id);
    CREATE INDEX idx_messages_created_at ON messages(created_at DESC);
    CREATE INDEX idx_messages_is_read ON messages(is_read);
  END IF;
END $$;

-- Step 4: Create conversations table without foreign key to messages
CREATE TABLE IF NOT EXISTS conversations (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  participant_1_id UUID NOT NULL REFERENCES profiles(id) ON DELETE CASCADE,
  participant_2_id UUID NOT NULL REFERENCES profiles(id) ON DELETE CASCADE,
  
  last_message_id UUID, -- Will add foreign key after both tables exist
  last_message_at TIMESTAMP WITH TIME ZONE,
  last_message_preview TEXT,
  
  participant_1_unread_count INTEGER DEFAULT 0,
  participant_2_unread_count INTEGER DEFAULT 0,
  
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  
  UNIQUE(participant_1_id, participant_2_id),
  CHECK (participant_1_id != participant_2_id)
);

-- Create indexes for conversations (only if they don't exist)
CREATE INDEX IF NOT EXISTS idx_conversations_participant_1 ON conversations(participant_1_id);
CREATE INDEX IF NOT EXISTS idx_conversations_participant_2 ON conversations(participant_2_id);
CREATE INDEX IF NOT EXISTS idx_conversations_last_message_at ON conversations(last_message_at DESC);

-- Step 5: Add foreign key from messages to conversations (if it doesn't exist)
DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM information_schema.table_constraints 
    WHERE constraint_name = 'messages_conversation_id_fkey'
    AND table_name = 'messages'
  ) THEN
    ALTER TABLE messages
      ADD CONSTRAINT messages_conversation_id_fkey
      FOREIGN KEY (conversation_id) REFERENCES conversations(id) ON DELETE CASCADE;
    
    CREATE INDEX IF NOT EXISTS idx_messages_conversation_id ON messages(conversation_id);
  END IF;
END $$;

-- Step 6: Add foreign key from conversations to messages (if it doesn't exist)
DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM information_schema.table_constraints 
    WHERE constraint_name = 'conversations_last_message_id_fkey'
    AND table_name = 'conversations'
  ) THEN
    ALTER TABLE conversations
      ADD CONSTRAINT conversations_last_message_id_fkey
      FOREIGN KEY (last_message_id) REFERENCES messages(id) ON DELETE SET NULL;
  END IF;
END $$;

-- Step 7: Enable RLS on both tables
ALTER TABLE conversations ENABLE ROW LEVEL SECURITY;
ALTER TABLE messages ENABLE ROW LEVEL SECURITY;

-- Step 8: Drop and recreate conversations policies
DROP POLICY IF EXISTS "Users can view their own conversations" ON conversations;
CREATE POLICY "Users can view their own conversations"
  ON conversations FOR SELECT
  USING (auth.uid() = participant_1_id OR auth.uid() = participant_2_id);

-- Step 9: Recreate messages policies (drop existing ones first to avoid conflicts)
DROP POLICY IF EXISTS "Users can view messages in their conversations" ON messages;
DROP POLICY IF EXISTS "Users can send messages" ON messages;
DROP POLICY IF EXISTS "Users can update their own sent messages" ON messages;

CREATE POLICY "Users can view messages in their conversations"
  ON messages FOR SELECT
  USING (auth.uid() = sender_id OR auth.uid() = receiver_id);

CREATE POLICY "Users can send messages"
  ON messages FOR INSERT
  WITH CHECK (auth.uid() = sender_id);

CREATE POLICY "Users can update their own sent messages"
  ON messages FOR UPDATE
  USING (auth.uid() = sender_id);

-- Step 10: Add updated_at trigger for conversations (drop if exists first)
DROP TRIGGER IF EXISTS update_conversations_updated_at ON conversations;
CREATE TRIGGER update_conversations_updated_at BEFORE UPDATE ON conversations
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

-- ============================================
-- FIX COMPLETE
-- ============================================

