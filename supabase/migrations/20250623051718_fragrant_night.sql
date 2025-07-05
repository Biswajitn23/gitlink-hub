/*
  # Create bookmarks and user repositories tables

  1. New Tables
    - `bookmarks`
      - `id` (uuid, primary key)
      - `user_id` (uuid, foreign key to auth.users)
      - `repository_id` (bigint, GitHub repository ID)
      - `repository_data` (jsonb, full repository data)
      - `created_at` (timestamp)
    - `user_repositories`
      - `id` (uuid, primary key)
      - `github_id` (bigint, unique GitHub repository ID)
      - `name` (text, repository name)
      - `full_name` (text, full repository name)
      - `description` (text, repository description)
      - `html_url` (text, repository URL)
      - `language` (text, primary language)
      - `stargazers_count` (integer, star count)
      - `forks_count` (integer, fork count)
      - `topics` (text array, repository topics)
      - `owner_login` (text, owner username)
      - `owner_avatar` (text, owner avatar URL)
      - `uploaded_by` (uuid, foreign key to auth.users)
      - `status` (text, approval status)
      - `created_at` (timestamp)

  2. Security
    - Enable RLS on both tables
    - Add policies for users to manage their own bookmarks
    - Add policies for users to manage their own repositories
    - Allow all users to view approved repositories
*/

-- Create bookmarks table
CREATE TABLE IF NOT EXISTS bookmarks (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL,
  repository_id bigint NOT NULL,
  repository_data jsonb NOT NULL,
  created_at timestamptz DEFAULT now()
);

-- Create user_repositories table
CREATE TABLE IF NOT EXISTS user_repositories (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  github_id bigint NOT NULL UNIQUE,
  name text NOT NULL,
  full_name text NOT NULL,
  description text,
  html_url text NOT NULL,
  language text,
  stargazers_count integer DEFAULT 0,
  forks_count integer DEFAULT 0,
  topics text[] DEFAULT '{}',
  owner_login text NOT NULL,
  owner_avatar text NOT NULL,
  uploaded_by uuid REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL,
  status text DEFAULT 'pending' NOT NULL,
  created_at timestamptz DEFAULT now()
);

-- Create submitted_repos table for educational resource uploads
CREATE TABLE IF NOT EXISTS submitted_repos (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  github_url text NOT NULL,
  description text,
  tech_stack text[] DEFAULT '{}',
  submitted_by text NOT NULL,
  created_at timestamptz DEFAULT now(),
  status text DEFAULT 'approved'
);

-- Enable Row Level Security
ALTER TABLE bookmarks ENABLE ROW LEVEL SECURITY;
ALTER TABLE user_repositories ENABLE ROW LEVEL SECURITY;
ALTER TABLE submitted_repos ENABLE ROW LEVEL SECURITY;

-- Create policies for bookmarks table
CREATE POLICY "Users can view their own bookmarks"
  ON bookmarks
  FOR SELECT
  TO authenticated
  USING (auth.uid() = user_id);

CREATE POLICY "Users can insert their own bookmarks"
  ON bookmarks
  FOR INSERT
  TO authenticated
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can delete their own bookmarks"
  ON bookmarks
  FOR DELETE
  TO authenticated
  USING (auth.uid() = user_id);

-- Create policies for user_repositories table
CREATE POLICY "Users can view all approved repositories"
  ON user_repositories
  FOR SELECT
  TO authenticated
  USING (status = 'approved');

CREATE POLICY "Users can view their own repositories"
  ON user_repositories
  FOR SELECT
  TO authenticated
  USING (auth.uid() = uploaded_by);

CREATE POLICY "Users can insert their own repositories"
  ON user_repositories
  FOR INSERT
  TO authenticated
  WITH CHECK (auth.uid() = uploaded_by);

CREATE POLICY "Users can update their own repositories"
  ON user_repositories
  FOR UPDATE
  TO authenticated
  USING (auth.uid() = uploaded_by);

CREATE POLICY "Users can delete their own repositories"
  ON user_repositories
  FOR DELETE
  TO authenticated
  USING (auth.uid() = uploaded_by);

-- Create policies for submitted_repos table
CREATE POLICY "Users can view their own submitted repos"
  ON submitted_repos
  FOR SELECT
  TO authenticated
  USING (auth.uid() = submitted_by);

CREATE POLICY "Users can insert their own submitted repos"
  ON submitted_repos
  FOR INSERT
  TO authenticated
  WITH CHECK (auth.uid() = submitted_by);

CREATE POLICY "Users can delete their own submitted repos"
  ON submitted_repos
  FOR DELETE
  TO authenticated
  USING (auth.uid() = submitted_by);

-- Create indexes for better performance
CREATE INDEX IF NOT EXISTS idx_bookmarks_user_id ON bookmarks(user_id);
CREATE INDEX IF NOT EXISTS idx_bookmarks_repository_id ON bookmarks(repository_id);
CREATE INDEX IF NOT EXISTS idx_user_repositories_uploaded_by ON user_repositories(uploaded_by);
CREATE INDEX IF NOT EXISTS idx_user_repositories_status ON user_repositories(status);
CREATE INDEX IF NOT EXISTS idx_user_repositories_github_id ON user_repositories(github_id);
CREATE INDEX IF NOT EXISTS idx_submitted_repos_submitted_by ON submitted_repos(submitted_by);
CREATE INDEX IF NOT EXISTS idx_submitted_repos_status ON submitted_repos(status);