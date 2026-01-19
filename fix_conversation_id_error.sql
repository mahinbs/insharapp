-- ============================================
-- QUICK FIX FOR "conversation_id does not exist" ERROR
-- ============================================
-- Run this script to fix the messages table structure
-- ============================================

-- Step 1: Drop foreign key constraint from conversations to messages if it exists
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

-- Step 2: Drop messages table if it exists (it might be missing conversation_id)
DROP TABLE IF EXISTS messages CASCADE;

-- Step 3: Ensure conversations table exists and is correct
-- Drop and recreate to ensure clean state
DROP TABLE IF EXISTS conversations CASCADE;

-- Recreate conversations table
CREATE TABLE conversations (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  participant_1_id UUID NOT NULL REFERENCES profiles(id) ON DELETE CASCADE,
  participant_2_id UUID NOT NULL REFERENCES profiles(id) ON DELETE CASCADE,
  
  last_message_id UUID, -- Foreign key will be added after messages table exists
  last_message_at TIMESTAMP WITH TIME ZONE,
  last_message_preview TEXT,
  
  participant_1_unread_count INTEGER DEFAULT 0,
  participant_2_unread_count INTEGER DEFAULT 0,
  
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  
  UNIQUE(participant_1_id, participant_2_id),
  CHECK (participant_1_id != participant_2_id)
);

CREATE INDEX idx_conversations_participant_1 ON conversations(participant_1_id);
CREATE INDEX idx_conversations_participant_2 ON conversations(participant_2_id);
CREATE INDEX idx_conversations_last_message_at ON conversations(last_message_at DESC);

-- Step 4: Create messages table with conversation_id column
CREATE TABLE messages (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  conversation_id UUID NOT NULL REFERENCES conversations(id) ON DELETE CASCADE,
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

CREATE INDEX idx_messages_conversation_id ON messages(conversation_id);
CREATE INDEX idx_messages_sender_id ON messages(sender_id);
CREATE INDEX idx_messages_receiver_id ON messages(receiver_id);
CREATE INDEX idx_messages_created_at ON messages(created_at DESC);
CREATE INDEX idx_messages_is_read ON messages(is_read);

-- Step 5: Add foreign key from conversations to messages
ALTER TABLE conversations
  ADD CONSTRAINT conversations_last_message_id_fkey
  FOREIGN KEY (last_message_id) REFERENCES messages(id) ON DELETE SET NULL;

-- Step 6: Enable RLS
ALTER TABLE conversations ENABLE ROW LEVEL SECURITY;
ALTER TABLE messages ENABLE ROW LEVEL SECURITY;

-- Step 7: Recreate RLS policies
DROP POLICY IF EXISTS "Users can view their own conversations" ON conversations;
CREATE POLICY "Users can view their own conversations"
  ON conversations FOR SELECT
  USING (auth.uid() = participant_1_id OR auth.uid() = participant_2_id);

DROP POLICY IF EXISTS "Users can view messages in their conversations" ON messages;
CREATE POLICY "Users can view messages in their conversations"
  ON messages FOR SELECT
  USING (auth.uid() = sender_id OR auth.uid() = receiver_id);

DROP POLICY IF EXISTS "Users can send messages" ON messages;
CREATE POLICY "Users can send messages"
  ON messages FOR INSERT
  WITH CHECK (auth.uid() = sender_id);

DROP POLICY IF EXISTS "Users can update their own sent messages" ON messages;
CREATE POLICY "Users can update their own sent messages"
  ON messages FOR UPDATE
  USING (auth.uid() = sender_id);

-- Step 8: Add updated_at trigger for conversations
DROP TRIGGER IF EXISTS update_conversations_updated_at ON conversations;
CREATE TRIGGER update_conversations_updated_at BEFORE UPDATE ON conversations
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

-- ============================================
-- FIX COMPLETE
-- ============================================
-- Both conversations and messages tables are now correctly created
-- ============================================



