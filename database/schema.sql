-- ==================================================
-- MedAIx Intelligent Research Support System
-- PostgreSQL Database Schema
-- ==================================================

-- Enable UUID extension
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- Create custom types
CREATE TYPE user_role AS ENUM ('admin', 'researcher', 'analyst', 'student');
CREATE TYPE project_status AS ENUM ('planning', 'active', 'completed', 'on_hold', 'cancelled');
CREATE TYPE analysis_status AS ENUM ('pending', 'processing', 'completed', 'failed', 'review_required');
CREATE TYPE methodology_type AS ENUM ('multidisciplinary_engineering', 'human_centered_design', 'design_thinking', 'agile_research', 'scientific_method', 'case_study', 'action_research');
CREATE TYPE knowledge_integration_type AS ENUM ('cross_reference', 'synthesis', 'comparison', 'validation', 'innovation');

-- ==================================================
-- CORE TABLES
-- ==================================================

-- Users table (enhanced from existing system)
CREATE TABLE users (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    email VARCHAR(255) UNIQUE NOT NULL,
    name VARCHAR(255) NOT NULL,
    avatar VARCHAR(500),
    role user_role DEFAULT 'researcher',
    institution VARCHAR(255),
    department VARCHAR(255),
    specialization TEXT[],
    orcid_id VARCHAR(50),
    google_scholar_id VARCHAR(50),
    linkedin_url VARCHAR(500),
    is_verified BOOLEAN DEFAULT false,
    preferences JSONB DEFAULT '{}',
    member_since TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    last_active TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- Academic Disciplines (mapping to academic taxonomy)
CREATE TABLE academic_disciplines (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    code VARCHAR(20) UNIQUE NOT NULL, -- e.g., 'ENG-CS', 'ENG-CE', 'PSY'
    name VARCHAR(255) NOT NULL,
    parent_discipline_id UUID REFERENCES academic_disciplines(id),
    level INTEGER NOT NULL DEFAULT 1, -- 1=field, 2=subfield, 3=specialization
    description TEXT,
    keywords TEXT[],
    is_active BOOLEAN DEFAULT true,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- ONET Occupations (Occupational Information Network data)
CREATE TABLE onet_occupations (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    onet_code VARCHAR(20) UNIQUE NOT NULL, -- e.g., '15-1252', '15-2051'
    title VARCHAR(255) NOT NULL,
    description TEXT,
    category VARCHAR(100), -- 'Healthcare', 'AI Research', 'Data Science', etc.
    subdomain VARCHAR(100),
    tasks TEXT[],
    skills TEXT[],
    knowledge_areas TEXT[],
    abilities TEXT[],
    education_level VARCHAR(100),
    is_active BOOLEAN DEFAULT true,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- Research Projects
CREATE TABLE research_projects (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    title VARCHAR(500) NOT NULL,
    description TEXT,
    status project_status DEFAULT 'planning',
    principal_investigator_id UUID NOT NULL REFERENCES users(id),
    start_date DATE,
    end_date DATE,
    funding_source VARCHAR(255),
    funding_amount DECIMAL(15,2),
    institutions TEXT[], -- Array of institutions involved
    methodology_type methodology_type NOT NULL,
    research_questions TEXT[],
    objectives TEXT[],
    hypotheses TEXT[],
    ethical_approval_required BOOLEAN DEFAULT false,
    ethical_approval_status VARCHAR(50),
    data_classification VARCHAR(50) DEFAULT 'public', -- public, restricted, confidential
    collaboration_level VARCHAR(50) DEFAULT 'individual', -- individual, institutional, international
    is_public BOOLEAN DEFAULT false,
    tags TEXT[],
    metadata JSONB DEFAULT '{}',
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- Many-to-many relationship: Research Projects <-> Academic Disciplines
CREATE TABLE project_disciplines (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    project_id UUID NOT NULL REFERENCES research_projects(id) ON DELETE CASCADE,
    discipline_id UUID NOT NULL REFERENCES academic_disciplines(id) ON DELETE CASCADE,
    primary_discipline BOOLEAN DEFAULT false,
    contribution_level VARCHAR(50) DEFAULT 'moderate', -- minimal, moderate, major, primary
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    UNIQUE(project_id, discipline_id)
);

-- Many-to-many relationship: Research Projects <-> ONET Occupations
CREATE TABLE project_occupations (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    project_id UUID NOT NULL REFERENCES research_projects(id) ON DELETE CASCADE,
    occupation_id UUID NOT NULL REFERENCES onet_occupations(id) ON DELETE CASCADE,
    relevance_level VARCHAR(50) DEFAULT 'moderate', -- minimal, moderate, high
    role_description TEXT,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    UNIQUE(project_id, occupation_id)
);

-- Methodology Steps (frameworks and templates)
CREATE TABLE methodology_steps (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    name VARCHAR(255) NOT NULL,
    description TEXT,
    methodology_type methodology_type NOT NULL,
    step_order INTEGER NOT NULL,
    estimated_duration_hours INTEGER,
    required_resources TEXT[],
    deliverables TEXT[],
    success_criteria TEXT[],
    dependencies UUID[], -- Array of step IDs this step depends on
    template_data JSONB DEFAULT '{}',
    is_active BOOLEAN DEFAULT true,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- Relationship: Research Projects <-> Methodology Steps
CREATE TABLE project_methodology_steps (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    project_id UUID NOT NULL REFERENCES research_projects(id) ON DELETE CASCADE,
    methodology_step_id UUID NOT NULL REFERENCES methodology_steps(id) ON DELETE CASCADE,
    assigned_to UUID REFERENCES users(id),
    status VARCHAR(50) DEFAULT 'pending', -- pending, in_progress, completed, blocked
    actual_start_date TIMESTAMP WITH TIME ZONE,
    actual_end_date TIMESTAMP WITH TIME ZONE,
    notes TEXT,
    deliverables_uploaded TEXT[], -- URLs to uploaded deliverables
    completion_percentage INTEGER DEFAULT 0,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    UNIQUE(project_id, methodology_step_id)
);

-- Uploaded Images (enhanced from existing system)
CREATE TABLE uploaded_images (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    project_id UUID REFERENCES research_projects(id) ON DELETE SET NULL,
    uploaded_by UUID NOT NULL REFERENCES users(id),
    file_name VARCHAR(500) NOT NULL,
    original_file_name VARCHAR(500),
    file_path VARCHAR(1000) NOT NULL,
    file_size BIGINT,
    mime_type VARCHAR(100),
    image_type VARCHAR(100), -- 'xray', 'mri', 'ct', 'ultrasound', etc.
    image_confidence DECIMAL(5,4), -- 0.0000 to 1.0000
    width INTEGER,
    height INTEGER,
    color_depth INTEGER,
    has_metadata BOOLEAN DEFAULT false,
    dicom_metadata JSONB,
    analysis_status analysis_status DEFAULT 'pending',
    tags TEXT[],
    description TEXT,
    consent_obtained BOOLEAN DEFAULT false,
    data_classification VARCHAR(50) DEFAULT 'restricted',
    anonymized BOOLEAN DEFAULT false,
    processing_started_at TIMESTAMP WITH TIME ZONE,
    processing_completed_at TIMESTAMP WITH TIME ZONE,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- Research Analyses (enhanced from existing system)
CREATE TABLE research_analyses (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    project_id UUID REFERENCES research_projects(id) ON DELETE SET NULL,
    image_id UUID REFERENCES uploaded_images(id) ON DELETE SET NULL,
    analyst_id UUID NOT NULL REFERENCES users(id),
    analysis_type VARCHAR(100) NOT NULL,
    status analysis_status DEFAULT 'pending',
    confidence_score DECIMAL(5,4),
    processing_time_seconds INTEGER,
    algorithm_version VARCHAR(50),
    model_used VARCHAR(100),
    findings JSONB, -- Structured findings data
    recommendations JSONB,
    differential_diagnosis JSONB,
    severity_assessment JSONB,
    regions_of_interest JSONB,
    quality_metrics JSONB,
    error_message TEXT,
    review_required BOOLEAN DEFAULT false,
    reviewed_by UUID REFERENCES users(id),
    reviewed_at TIMESTAMP WITH TIME ZONE,
    review_notes TEXT,
    approved_by UUID REFERENCES users(id),
    approved_at TIMESTAMP WITH TIME ZONE,
    metadata JSONB DEFAULT '{}',
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- Knowledge Integrations (cross-disciplinary knowledge mapping)
CREATE TABLE knowledge_integrations (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    project_id UUID NOT NULL REFERENCES research_projects(id) ON DELETE CASCADE,
    source_discipline_id UUID NOT NULL REFERENCES academic_disciplines(id),
    target_discipline_id UUID NOT NULL REFERENCES academic_disciplines(id),
    integration_type knowledge_integration_type NOT NULL,
    title VARCHAR(500) NOT NULL,
    description TEXT,
    source_knowledge TEXT,
    target_application TEXT,
    integration_method TEXT,
    validation_status VARCHAR(50) DEFAULT 'pending',
    validation_notes TEXT,
    novelty_score DECIMAL(3,2), -- 0.00 to 1.00
    impact_potential VARCHAR(50), -- low, medium, high
    implementation_feasibility VARCHAR(50), -- low, medium, high
    references TEXT[],
    supporting_evidence JSONB,
    created_by UUID NOT NULL REFERENCES users(id),
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- Project Collaborators
CREATE TABLE project_collaborators (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    project_id UUID NOT NULL REFERENCES research_projects(id) ON DELETE CASCADE,
    user_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    role VARCHAR(100) NOT NULL, -- 'co_investigator', 'research_assistant', 'consultant', etc.
    permissions JSONB DEFAULT '{}',
    contribution_description TEXT,
    joined_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    status VARCHAR(50) DEFAULT 'active', -- active, inactive, pending, removed
    UNIQUE(project_id, user_id)
);

-- ==================================================
-- INDEXES FOR PERFORMANCE
-- ==================================================

-- Users indexes
CREATE INDEX idx_users_email ON users(email);
CREATE INDEX idx_users_role ON users(role);
CREATE INDEX idx_users_last_active ON users(last_active);

-- Research Projects indexes
CREATE INDEX idx_projects_pi ON research_projects(principal_investigator_id);
CREATE INDEX idx_projects_status ON research_projects(status);
CREATE INDEX idx_projects_dates ON research_projects(start_date, end_date);
CREATE INDEX idx_projects_methodology ON research_projects(methodology_type);
CREATE INDEX idx_projects_public ON research_projects(is_public);

-- Images indexes
CREATE INDEX idx_images_project ON uploaded_images(project_id);
CREATE INDEX idx_images_uploader ON uploaded_images(uploaded_by);
CREATE INDEX idx_images_type ON uploaded_images(image_type);
CREATE INDEX idx_images_status ON uploaded_images(analysis_status);
CREATE INDEX idx_images_created ON uploaded_images(created_at);

-- Analyses indexes
CREATE INDEX idx_analyses_project ON research_analyses(project_id);
CREATE INDEX idx_analyses_image ON research_analyses(image_id);
CREATE INDEX idx_analysts ON research_analyses(analyst_id);
CREATE INDEX idx_analyses_status ON research_analyses(status);
CREATE INDEX idx_analyses_confidence ON research_analyses(confidence_score);

-- Knowledge Integration indexes
CREATE INDEX idx_knowledge_project ON knowledge_integrations(project_id);
CREATE INDEX idx_knowledge_disciplines ON knowledge_integrations(source_discipline_id, target_discipline_id);
CREATE INDEX idx_knowledge_type ON knowledge_integrations(integration_type);

-- ==================================================
-- TRIGGERS FOR UPDATED_AT
-- ==================================================

CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = CURRENT_TIMESTAMP;
    RETURN NEW;
END;
$$ language 'plpgsql';

CREATE TRIGGER update_users_updated_at BEFORE UPDATE ON users FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
CREATE TRIGGER update_projects_updated_at BEFORE UPDATE ON research_projects FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
CREATE TRIGGER update_images_updated_at BEFORE UPDATE ON uploaded_images FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
CREATE TRIGGER update_analyses_updated_at BEFORE UPDATE ON research_analyses FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
CREATE TRIGGER update_knowledge_updated_at BEFORE UPDATE ON knowledge_integrations FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
CREATE TRIGGER update_methodology_steps_updated_at BEFORE UPDATE ON project_methodology_steps FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

-- ==================================================
-- VIEWS FOR COMMON QUERIES
-- ==================================================

-- User statistics view (maintaining compatibility with existing localStorage structure)
CREATE VIEW user_statistics AS
SELECT 
    u.id as user_id,
    COUNT(DISTINCT rp.id) as total_projects,
    COUNT(DISTINCT CASE WHEN rp.status = 'active' THEN rp.id END) as active_projects,
    COUNT(DISTINCT CASE WHEN rp.status = 'completed' THEN rp.id END) as completed_projects,
    COUNT(DISTINCT ai.id) as total_analyses,
    COUNT(DISTINCT CASE WHEN ai.status = 'completed' THEN ai.id END) as successful_analyses,
    CASE 
        WHEN COUNT(DISTINCT ai.id) > 0 
        THEN ROUND((COUNT(DISTINCT CASE WHEN ai.status = 'completed' THEN ai.id END)::DECIMAL / COUNT(DISTINCT ai.id)) * 100)
        ELSE 0 
    END as success_rate,
    COUNT(DISTINCT CASE WHEN DATE_TRUNC('month', ai.created_at) = DATE_TRUNC('month', CURRENT_DATE) THEN ai.id END) as analyses_this_month,
    CASE 
        WHEN COUNT(DISTINCT ai.id) > 0 
        THEN ROUND(AVG(ai.confidence_score) * 100, 2)
        ELSE 0 
    END as avg_confidence,
    u.last_active,
    u.created_at as member_since
FROM users u
LEFT JOIN research_projects rp ON u.id = rp.principal_investigator_id
LEFT JOIN research_analyses ai ON u.id = ai.analyst_id
GROUP BY u.id, u.last_active, u.created_at;

-- Project summary view
CREATE VIEW project_summary AS
SELECT 
    rp.id,
    rp.title,
    rp.status,
    rp.methodology_type,
    u.name as principal_investigator,
    u.institution,
    COUNT(DISTINCT pc.user_id) as collaborator_count,
    COUNT(DISTINCT ui.id) as image_count,
    COUNT(DISTINCT CASE WHEN ui.analysis_status = 'completed' THEN ui.id END) as analyzed_images,
    COUNT(DISTINCT ra.id) as analysis_count,
    AVG(ra.confidence_score) as avg_confidence,
    rp.start_date,
    rp.end_date,
    rp.created_at
FROM research_projects rp
JOIN users u ON rp.principal_investigator_id = u.id
LEFT JOIN project_collaborators pc ON rp.id = pc.project_id AND pc.status = 'active'
LEFT JOIN uploaded_images ui ON rp.id = ui.project_id
LEFT JOIN research_analyses ra ON rp.id = ra.project_id
GROUP BY rp.id, rp.title, rp.status, rp.methodology_type, u.name, u.institution, rp.start_date, rp.end_date, rp.created_at;

-- ==================================================
-- COMMENTS FOR DOCUMENTATION
-- ==================================================

COMMENT ON TABLE users IS 'Enhanced user management with research-specific fields';
COMMENT ON TABLE research_projects IS 'Research project management with multidisciplinary support';
COMMENT ON TABLE methodology_steps IS 'Research methodology frameworks and templates';
COMMENT ON TABLE uploaded_images IS 'Enhanced image management with research project linkage';
COMMENT ON TABLE research_analyses IS 'Analysis results with multidisciplinary context';
COMMENT ON TABLE knowledge_integrations IS 'Cross-disciplinary knowledge mapping and synthesis';
COMMENT ON TABLE project_disciplines IS 'Many-to-many relationship between projects and academic disciplines';
COMMENT ON TABLE project_occupations IS 'Many-to-many relationship between projects and ONET occupations';
COMMENT ON TABLE project_methodology_steps IS 'Implementation of methodology steps within specific projects';
COMMENT ON VIEW user_statistics IS 'User analytics maintaining compatibility with existing localStorage structure';
