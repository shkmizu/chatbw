-- Fix security issue: Add RLS policies to n8n_chat_histories table

-- Step 1: Add user_id column to associate chat sessions with users
ALTER TABLE public.n8n_chat_histories 
ADD COLUMN user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE;

-- Step 2: Enable Row Level Security
ALTER TABLE public.n8n_chat_histories ENABLE ROW LEVEL SECURITY;

-- Step 3: Create RLS policies to restrict access to user's own chat sessions

-- Policy for SELECT: Users can only view their own chat histories
CREATE POLICY "Users can view their own chat histories" 
ON public.n8n_chat_histories 
FOR SELECT 
USING (auth.uid() = user_id);

-- Policy for INSERT: Users can only insert chat histories for themselves
CREATE POLICY "Users can insert their own chat histories" 
ON public.n8n_chat_histories 
FOR INSERT 
WITH CHECK (auth.uid() = user_id);

-- Policy for UPDATE: Users can only update their own chat histories
CREATE POLICY "Users can update their own chat histories" 
ON public.n8n_chat_histories 
FOR UPDATE 
USING (auth.uid() = user_id);

-- Policy for DELETE: Users can only delete their own chat histories
CREATE POLICY "Users can delete their own chat histories" 
ON public.n8n_chat_histories 
FOR DELETE 
USING (auth.uid() = user_id);

-- Step 4: Also enable RLS on the documents table if not already done
ALTER TABLE public.documents ENABLE ROW LEVEL SECURITY;

-- Create a policy for documents - assuming they should be readable by authenticated users
CREATE POLICY "Authenticated users can read documents" 
ON public.documents 
FOR SELECT 
TO authenticated
USING (true);

-- Step 5: Enable RLS on n8n-oracle-db table
ALTER TABLE public."n8n-oracle-db" ENABLE ROW LEVEL SECURITY;

-- Create a restrictive policy for n8n-oracle-db (adjust as needed based on use case)
CREATE POLICY "Authenticated users can read oracle db entries" 
ON public."n8n-oracle-db" 
FOR SELECT 
TO authenticated
USING (true);