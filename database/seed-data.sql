-- ==================================================
-- MedAIx Intelligent Research Support System
-- Seed Data for Academic Disciplines, ONET Occupations, and Methodologies
-- ==================================================

-- ==================================================
-- ACADEMIC DISCIPLINES
-- ==================================================

-- Main Engineering Disciplines
INSERT INTO academic_disciplines (id, code, name, parent_discipline_id, level, description, keywords, is_active) VALUES
(uuid_generate_v4(), 'ENG', 'Engineering', NULL, 1, 'The application of science and mathematics to design and build structures, machines, devices, systems, and processes', ARRAY['engineering', 'design', 'construction', 'manufacturing'], true);

-- Computer Engineering (as requested)
INSERT INTO academic_disciplines (id, code, name, parent_discipline_id, level, description, keywords, is_active) VALUES
(uuid_generate_v4(), 'ENG-CE', 'Computer Engineering', (SELECT id FROM academic_disciplines WHERE code = 'ENG'), 2, 'Design and development of computer systems, hardware, and software integration', ARRAY['computer systems', 'hardware', 'software', 'embedded systems', 'digital circuits'], true);

-- Software Engineering (as requested)
INSERT INTO academic_disciplines (id, code, name, parent_discipline_id, level, description, keywords, is_active) VALUES
(uuid_generate_v4(), 'ENG-SE', 'Software Engineering', (SELECT id FROM academic_disciplines WHERE code = 'ENG'), 2, 'Systematic application of engineering principles to software development', ARRAY['software development', 'programming', 'algorithms', 'data structures', 'software architecture'], true);

-- Psychology (as requested)
INSERT INTO academic_disciplines (id, code, name, parent_discipline_id, level, description, keywords, is_active) VALUES
(uuid_generate_v4(), 'PSY', 'Psychology', NULL, 1, 'Scientific study of mind and behavior', ARRAY['cognitive science', 'behavioral analysis', 'human factors', 'neuropsychology'], true);

-- Biomedical Engineering (relevant for medical image analysis)
INSERT INTO academic_disciplines (id, code, name, parent_discipline_id, level, description, keywords, is_active) VALUES
(uuid_generate_v4(), 'ENG-BME', 'Biomedical Engineering', (SELECT id FROM academic_disciplines WHERE code = 'ENG'), 2, 'Application of engineering principles to biological systems and healthcare', ARRAY['medical imaging', 'biomaterials', 'biomechanics', 'medical devices', 'prosthetics'], true);

-- Data Science (multidisciplinary field)
INSERT INTO academic_disciplines (id, code, name, parent_discipline_id, level, description, keywords, is_active) VALUES
(uuid_generate_v4(), 'DS', 'Data Science', NULL, 1, 'Interdisciplinary field combining statistics, computer science, and domain expertise', ARRAY['machine learning', 'data mining', 'statistics', 'visualization', 'big data'], true);

-- Artificial Intelligence
INSERT INTO academic_disciplines (id, code, name, parent_discipline_id, level, description, keywords, is_active) VALUES
(uuid_generate_v4(), 'AI', 'Artificial Intelligence', (SELECT id FROM academic_disciplines WHERE code = 'DS'), 2, 'Development of intelligent systems and machine learning algorithms', ARRAY['machine learning', 'neural networks', 'natural language processing', 'computer vision', 'robotics'], true);

-- Sub-specializations for Computer Engineering
INSERT INTO academic_disciplines (id, code, name, parent_discipline_id, level, description, keywords, is_active) VALUES
(uuid_generate_v4(), 'ENG-CE-HW', 'Computer Hardware Engineering', (SELECT id FROM academic_disciplines WHERE code = 'ENG-CE'), 3, 'Design and development of computer hardware components', ARRAY['processors', 'memory systems', 'computer architecture', 'digital design'], true),
(uuid_generate_v4(), 'ENG-CE-SW', 'Computer Software Engineering', (SELECT id FROM academic_disciplines WHERE code = 'ENG-CE'), 3, 'Software development for computer systems', ARRAY['operating systems', 'system software', 'compiler design', 'computer networks'], true),
(uuid_generate_v4(), 'ENG-CE-AI', 'AI Hardware Systems', (SELECT id FROM academic_disciplines WHERE code = 'ENG-CE'), 3, 'Hardware acceleration for AI and machine learning', ARRAY['GPUs', 'ASICs', 'neural processing units', 'parallel computing'], true);

-- Sub-specializations for Software Engineering
INSERT INTO academic_disciplines (id, code, name, parent_discipline_id, level, description, keywords, is_active) VALUES
(uuid_generate_v4(), 'ENG-SE-WEB', 'Web Engineering', (SELECT id FROM academic_disciplines WHERE code = 'ENG-SE'), 3, 'Engineering principles applied to web development', ARRAY['web applications', 'distributed systems', 'cloud computing', 'microservices'], true),
(uuid_generate_v4(), 'ENG-SE-ML', 'Machine Learning Engineering', (SELECT id FROM academic_disciplines WHERE code = 'ENG-SE'), 3, 'Engineering scalable machine learning systems', ARRAY['MLOps', 'model deployment', 'data pipelines', 'model monitoring'], true),
(uuid_generate_v4(), 'ENG-SE-SEC', 'Software Security Engineering', (SELECT id FROM academic_disciplines WHERE code = 'ENG-SE'), 3, 'Security-focused software development', ARRAY['cybersecurity', 'secure coding', 'penetration testing', 'cryptography'], true);

-- Sub-specializations for Psychology
INSERT INTO academic_disciplines (id, code, name, parent_discipline_id, level, description, keywords, is_active) VALUES
(uuid_generate_v4(), 'PSY-COG', 'Cognitive Psychology', (SELECT id FROM academic_disciplines WHERE code = 'PSY'), 2, 'Study of mental processes including perception, memory, and decision-making', ARRAY['cognition', 'perception', 'memory', 'attention', 'decision making'], true),
(uuid_generate_v4(), 'PSY-HF', 'Human Factors Psychology', (SELECT id FROM academic_disciplines WHERE code = 'PSY'), 2, 'Study of human-machine interaction and usability', ARRAY['human-computer interaction', 'usability', 'user experience', 'ergonomics'], true),
(uuid_generate_v4(), 'PSY-NEURO', 'Neuropsychology', (SELECT id FROM academic_disciplines WHERE code = 'PSY'), 2, 'Study of brain-behavior relationships', ARRAY['brain imaging', 'neurological assessment', 'cognitive rehabilitation', 'neural networks'], true);

-- ==================================================
-- ONET OCCUPATIONS
-- ==================================================

-- Healthcare Related Occupations (as requested)
INSERT INTO onet_occupations (id, onet_code, title, description, category, subdomain, tasks, skills, knowledge_areas, abilities, education_level, is_active) VALUES
(uuid_generate_v4(), '29-1228', 'Physicians, All Other; and Ophthalmologists, Except Pediatric', 'Diagnose, treat, and help prevent diseases and injuries in humans', 'Healthcare', 'Medical Practice', 
 ARRAY['Diagnose medical conditions', 'Treat patients using medications and therapies', 'Perform physical examinations', 'Order and interpret diagnostic tests', 'Prescribe medications'],
 ARRAY['Critical thinking', 'Problem solving', 'Communication', 'Decision making', 'Active listening'],
 ARRAY['Medicine and dentistry', 'Biology', 'Psychology', 'Chemistry', 'Customer and personal service'],
 ARRAY['Problem sensitivity', 'Near vision', 'Deductive reasoning', 'Inductive reasoning', 'Oral comprehension'],
 'Doctoral or professional degree', true),

(uuid_generate_v4(), '29-2031', 'Cardiovascular Technologists and Technicians', 'Conduct tests on pulmonary or cardiovascular systems of patients', 'Healthcare', 'Medical Technology',
 ARRAY['Conduct cardiovascular tests', 'Monitor patients during procedures', 'Prepare patients for procedures', 'Analyze test results', 'Maintain equipment'],
 ARRAY['Operation monitoring', 'Reading comprehension', 'Active listening', 'Critical thinking', 'Problem solving'],
 ARRAY['Medicine and dentistry', 'Biology', 'Customer and personal service', 'Chemistry', 'Physics'],
 ARRAY['Near vision', 'Problem sensitivity', 'Arm-hand steadiness', 'Finger dexterity', 'Auditory attention'],
 'Associate degree', true),

(uuid_generate_v4(), '29-2032', 'Diagnostic Medical Sonographers', 'Operate ultrasound equipment to produce diagnostic images', 'Healthcare', 'Medical Imaging',
 ARRAY['Operate ultrasound equipment', 'Analyze images for quality', 'Prepare patients for procedures', 'Record findings', 'Maintain patient records'],
 ARRAY['Operation monitoring', 'Reading comprehension', 'Critical thinking', 'Active listening', 'Problem solving'],
 ARRAY['Medicine and dentistry', 'Biology', 'Customer and personal service', 'Physics', 'Chemistry'],
 ARRAY['Near vision', 'Problem sensitivity', 'Arm-hand steadiness', 'Finger dexterity', 'Auditory attention'],
 'Associate degree', true),

-- AI Research Related Occupations (as requested)
INSERT INTO onet_occupations (id, onet_code, title, description, category, subdomain, tasks, skills, knowledge_areas, abilities, education_level, is_active) VALUES
(uuid_generate_v4(), '15-2051', 'Data Scientists', 'Analyze and interpret complex data to help organizations make decisions', 'AI Research', 'Data Science',
 ARRAY['Analyze large datasets', 'Build predictive models', 'Develop algorithms', 'Create data visualizations', 'Communicate findings'],
 ARRAY['Programming', 'Statistical analysis', 'Machine learning', 'Data visualization', 'Critical thinking'],
 ARRAY['Mathematics', 'Computer science', 'Statistics', 'Engineering', 'Business'],
 ARRAY['Mathematical reasoning', 'Problem sensitivity', 'Deductive reasoning', 'Inductive reasoning', 'Information ordering'],
 'Bachelor\'s degree', true),

(uuid_generate_v4(), '15-1252', 'Software Developers', 'Design, develop, and modify software systems', 'AI Research', 'Software Engineering',
 ARRAY['Design software systems', 'Write and test code', 'Debug programs', 'Collaborate with teams', 'Maintain software'],
 ARRAY['Programming', 'Problem solving', 'Critical thinking', 'Attention to detail', 'Communication'],
 ARRAY['Computer programming', 'Mathematics', 'Engineering', 'English language', 'Design'],
 ARRAY['Problem sensitivity', 'Near vision', 'Deductive reasoning', 'Information ordering', 'Finger dexterity'],
 'Bachelor\'s degree', true),

(uuid_generate_v4(), '15-2051.01', 'Machine Learning Engineers', 'Design and implement machine learning systems', 'AI Research', 'Machine Learning',
 ARRAY['Design ML algorithms', 'Implement model training pipelines', 'Optimize model performance', 'Deploy ML models', 'Monitor model accuracy'],
 ARRAY['Machine learning', 'Programming', 'Statistical modeling', 'Data engineering', 'System design'],
 ARRAY['Computer science', 'Mathematics', 'Statistics', 'Engineering', 'Artificial intelligence'],
 ARRAY['Mathematical reasoning', 'Problem sensitivity', 'Deductive reasoning', 'Information ordering', 'Category flexibility'],
 'Bachelor\'s degree', true),

-- Data Science Related Occupations (as requested)
INSERT INTO onet_occupations (id, onet_code, title, description, category, subdomain, tasks, skills, knowledge_areas, abilities, education_level, is_active) VALUES
(uuid_generate_v4(), '15-1299.09', 'Data Engineers', 'Develop, construct, test, and maintain architectures', 'Data Science', 'Data Engineering',
 ARRAY['Design data pipelines', 'Build data infrastructure', 'Optimize data processing', 'Ensure data quality', 'Scale data systems'],
 ARRAY['Programming', 'Data modeling', 'Database design', 'Cloud computing', 'Problem solving'],
 ARRAY['Computer programming', 'Mathematics', 'Engineering', 'Database management', 'Statistics'],
 ARRAY['Problem sensitivity', 'Information ordering', 'Mathematical reasoning', 'Deductive reasoning', 'Category flexibility'],
 'Bachelor\'s degree', true),

(uuid_generate_v4(), '15-1299.01', 'Data Architects', 'Design and build data systems and databases', 'Data Science', 'Data Architecture',
 ARRAY['Design database systems', 'Create data models', 'Optimize data storage', 'Plan data governance', 'Develop data standards'],
 ARRAY['Database design', 'Systems thinking', 'Problem solving', 'Communication', 'Analytical thinking'],
 ARRAY['Computer programming', 'Mathematics', 'Database management', 'Engineering', 'Business'],
 ARRAY['Problem sensitivity', 'Information ordering', 'Deductive reasoning', 'Mathematical reasoning', 'Category flexibility'],
 'Bachelor\'s degree', true),

(uuid_generate_v4(), '15-2051.02', 'Business Intelligence Analysts', 'Analyze business data to support decision-making', 'Data Science', 'Business Analytics',
 ARRAY['Analyze business performance', 'Create reports and dashboards', 'Identify business trends', 'Support strategic decisions', 'Present findings'],
 ARRAY['Data analysis', 'Business acumen', 'Communication', 'Statistical analysis', 'Visualization'],
 ARRAY['Business', 'Mathematics', 'Computer science', 'Statistics', 'Economics'],
 ARRAY['Problem sensitivity', 'Information ordering', 'Deductive reasoning', 'Mathematical reasoning', 'Oral comprehension'],
 'Bachelor\'s degree', true),

-- Additional relevant AI/Technology occupations
INSERT INTO onet_occupations (id, onet_code, title, description, category, subdomain, tasks, skills, knowledge_areas, abilities, education_level, is_active) VALUES
(uuid_generate_v4(), '15-1243', 'Database Administrators and Architects', 'Design, build, and maintain computer databases', 'Data Science', 'Database Systems',
 ARRAY['Design database structures', 'Optimize database performance', 'Ensure data security', 'Backup and recover data', 'Troubleshoot issues'],
 ARRAY['Database management', 'Problem solving', 'Attention to detail', 'Analytical thinking', 'Communication'],
 ARRAY['Computer programming', 'Database management', 'Mathematics', 'Engineering', 'Business'],
 ARRAY['Problem sensitivity', 'Information ordering', 'Deductive reasoning', 'Mathematical reasoning', 'Category flexibility'],
 'Bachelor\'s degree', true),

(uuid_generate_v4(), '15-1255', 'Web Developers and Digital Interface Designers', 'Design and develop websites and digital interfaces', 'Data Science', 'Web Development',
 ARRAY['Design user interfaces', 'Develop web applications', 'Optimize user experience', 'Ensure responsive design', 'Test functionality'],
 ARRAY['Web development', 'UI/UX design', 'Programming', 'Problem solving', 'Creative thinking'],
 ARRAY['Computer programming', 'Design', 'Mathematics', 'Communication', 'Psychology'],
 ARRAY['Problem sensitivity', 'Finger dexterity', 'Near vision', 'Information ordering', 'Category flexibility'],
 'Bachelor\'s degree', true),

-- ==================================================
-- METHODOLOGY STEPS
-- ==================================================

-- Multidisciplinary Engineering Analysis (as requested)
INSERT INTO methodology_steps (id, name, description, methodology_type, step_order, estimated_duration_hours, required_resources, deliverables, success_criteria, dependencies, template_data, is_active) VALUES
(uuid_generate_v4(), 'Problem Definition and Scope Analysis', 'Clearly define the engineering problem and establish multidisciplinary scope', 'multidisciplinary_engineering', 1, 8, 
 ARRAY['Subject matter experts', 'Project charter template', 'Literature review tools'],
 ARRAY['Problem statement document', 'Scope definition', 'Stakeholder requirements'],
 ARRAY['Clear problem statement', 'Defined boundaries', 'Stakeholder alignment'],
 ARRAY[]::UUID[],
 '{"templates": ["problem_charter", "stakeholder_analysis"], "tools": ["literature_review"]}',
 true),

(uuid_generate_v4(), 'Domain Knowledge Integration', 'Gather and integrate knowledge from relevant engineering disciplines', 'multidisciplinary_engineering', 2, 12,
 ARRAY['Discipline experts', 'Technical databases', 'Academic papers'],
 ARRAY['Domain knowledge synthesis', 'Cross-disciplinary connections', 'Knowledge gaps analysis'],
 ARRAY['Comprehensive domain coverage', 'Identified connections', 'Gap analysis'],
 ARRAY[(SELECT id FROM methodology_steps WHERE name = 'Problem Definition and Scope Analysis')]::UUID[],
 '{"templates": ["knowledge_integration", "discipline_matrix"], "references": ["academic_papers", "industry_standards"]}',
 true),

(uuid_generate_v4(), 'Systems Modeling and Analysis', 'Create integrated models combining multiple engineering domains', 'multidisciplinary_engineering', 3, 16,
 ARRAY['Modeling software', 'Simulation tools', 'Technical computing platforms'],
 ARRAY['System models', 'Simulation results', 'Performance analysis'],
 ARRAY['Accurate models', 'Validated simulations', 'Performance metrics'],
 ARRAY[(SELECT id FROM methodology_steps WHERE name = 'Domain Knowledge Integration')]::UUID[],
 '{"tools": ["CAD", "MATLAB", "ANSYS", "Simulink"], "outputs": ["models", "simulations"]}',
 true),

(uuid_generate_v4(), 'Multi-Objective Optimization', 'Optimize system performance across multiple engineering criteria', 'multidisciplinary_engineering', 4, 20,
 ARRAY['Optimization software', 'High-performance computing', 'Statistical tools'],
 ARRAY['Optimization results', 'Trade-off analysis', 'Optimal solutions'],
 ARRAY['Pareto-optimal solutions', 'Trade-off understanding', 'Validated results'],
 ARRAY[(SELECT id FROM methodology_steps WHERE name = 'Systems Modeling and Analysis')]::UUID[],
 '{"algorithms": ["genetic_algorithm", "simulated_annealing", "NSGA"], "metrics": ["efficiency", "cost", "reliability"]}',
 true),

(uuid_generate_v4(), 'Validation and Verification', 'Validate results through testing, simulation, or expert review', 'multidisciplinary_engineering', 5, 10,
 ARRAY['Testing facilities', 'Validation datasets', 'Expert panel'],
 ARRAY['Validation report', 'Test results', 'Verification documentation'],
 ARRAY['Successful validation', 'Verified performance', 'Expert consensus'],
 ARRAY[(SELECT id FROM methodology_steps WHERE name = 'Multi-Objective Optimization')]::UUID[],
 '{"methods": ["experimental", "analytical", "expert_review"], "criteria": ["accuracy", "reliability"]}',
 true);

-- Human-Centered Design (as requested)
INSERT INTO methodology_steps (id, name, description, methodology_type, step_order, estimated_duration_hours, required_resources, deliverables, success_criteria, dependencies, template_data, is_active) VALUES
(uuid_generate_v4(), 'Empathize: Understanding Users', 'Deep understanding of user needs, behaviors, and motivations', 'human_centered_design', 1, 12,
 ARRAY['User research tools', 'Interview guides', 'Observation protocols'],
 ARRAY['User personas', 'Journey maps', 'Empathy maps', 'User insights'],
 ARRAY['Rich user understanding', 'Clear user needs', 'Behavioral insights'],
 ARRAY[]::UUID[],
 '{"methods": ["interviews", "observations", "surveys"], "tools": ["persona_template", "journey_map"]}',
 true),

(uuid_generate_v4(), 'Define: Problem Framing', 'Synthesize research into clear problem statements and design criteria', 'human_centered_design', 2, 8,
 ARRAY['Synthesis tools', 'Problem framing frameworks', 'Stakeholder workshops'],
 ARRAY['Problem statements', 'Design criteria', 'How Might We statements'],
 ARRAY['Clear problem definition', 'Agreed criteria', 'Creative challenges'],
 ARRAY[(SELECT id FROM methodology_steps WHERE name = 'Empathize: Understanding Users')]::UUID[],
 '{"frameworks": ["problem_statement", "design_brief"], "outputs": ["criteria", "opportunities"]}',
 true),

(uuid_generate_v4(), 'Ideate: Creative Solution Generation', 'Generate broad range of creative solutions and approaches', 'human_centered_design', 3, 10,
 ARRAY['Ideation tools', 'Brainstorming facilitation', 'Visualization materials'],
 ARRAY['Solution concepts', 'Idea clusters', 'Creative insights'],
 ARRAY['Diverse solution set', 'Creative thinking', 'Innovation potential'],
 ARRAY[(SELECT id FROM methodology_steps WHERE name = 'Define: Problem Framing')]::UUID[],
 '{"techniques": ["brainstorming", "SCAMPER", "mind_mapping"], "outputs": ["concepts", "insights"]}',
 true),

(uuid_generate_v4(), 'Prototype: Tangible Representations', 'Build tangible representations of ideas for testing and refinement', 'human_centered_design', 4, 16,
 ARRAY['Prototyping materials', 'Rapid prototyping tools', 'User testing space'],
 ARRAY['Working prototypes', 'Prototype variations', 'Testing results'],
 ARRAY['Functional prototypes', 'User feedback', 'Iteration insights'],
 ARRAY[(SELECT id FROM methodology_steps WHERE name = 'Ideate: Creative Solution Generation')]::UUID[],
 '{"tools": ["3D_printing", "wireframing", "interactive_prototypes"], "materials": ["paper", "digital"]}',
 true),

(uuid_generate_v4(), 'Test: User Evaluation and Iteration', 'Test prototypes with users and iterate based on feedback', 'human_centered_design', 5, 12,
 ARRAY['User testing protocols', 'Evaluation frameworks', 'Feedback collection tools'],
 ARRAY['Test results', 'Iteration recommendations', 'Design refinements'],
 ARRAY['Validated solutions', 'User acceptance', 'Iterative improvements'],
 ARRAY[(SELECT id FROM methodology_steps WHERE name = 'Prototype: Tangible Representations')]::UUID[],
 '{"methods": ["usability_testing", "A/B_testing", "feedback_sessions"], "metrics": ["usability", "satisfaction"]}',
 true);

-- Additional Methodology: Design Thinking (complementary to Human-Centered Design)
INSERT INTO methodology_steps (id, name, description, methodology_type, step_order, estimated_duration_hours, required_resources, deliverables, success_criteria, dependencies, template_data, is_active) VALUES
(uuid_generate_v4(), 'Human-Centered Research', 'Deep understanding of human needs and context', 'design_thinking', 1, 10,
 ARRAY['Research tools', 'Ethnographic methods', 'User observation'],
 ARRAY['User insights', 'Context analysis', 'Need identification'],
 ARRAY['Deep user understanding', 'Contextual insights', 'Authentic needs'],
 ARRAY[]::UUID[],
 '{"methods": ["ethnographic_study", "contextual_inquiry"], "deliverables": ["insights", "opportunities"]}',
 true),

(uuid_generate_v4(), 'Problem Redefinition', 'Redefine problems based on human insights', 'design_thinking', 2, 6,
 ARRAY['Synthesis workshops', 'Reframing tools', 'Challenge statements'],
 ARRAY['Refined problem statements', 'Challenge reframes', 'Insight connections'],
 ARRAY['Human-centered problems', 'Clear challenges', 'Insight integration'],
 ARRAY[(SELECT id FROM methodology_steps WHERE name = 'Human-Centered Research')]::UUID[],
 '{"frameworks": ["point_of_view", "how_might_we"], "outputs": ["challenges", "directions"]}',
 true),

(uuid_generate_v4(), 'Concept Development', 'Develop multiple concepts and approaches', 'design_thinking', 3, 12,
 ARRAY['Concept development tools', 'Visualization materials', 'Storytelling resources'],
 ARRAY['Concept alternatives', 'Solution approaches', 'Design principles'],
 ARRAY['Diverse concepts', 'Clear approaches', 'Design logic'],
 ARRAY[(SELECT id FROM methodology_steps WHERE name = 'Problem Redefinition')]::UUID[],
 '{"tools": ["concept_development", "storytelling"], "outputs": ["concepts", "principles"]}',
 true),

(uuid_generate_v4(), 'Rapid Prototyping', 'Quickly build and test multiple prototypes', 'design_thinking', 4, 14,
 ARRAY['Rapid prototyping tools', 'Testing materials', 'Feedback collection'],
 ARRAY['Prototype series', 'Testing feedback', 'Iteration insights'],
 ARRAY['Multiple prototypes', 'Clear feedback', 'Iteration direction'],
 ARRAY[(SELECT id FROM methodology_steps WHERE name = 'Concept Development')]::UUID[],
 '{"tools": ["rapid_prototyping", "mockups"], "materials": ["various"]}',
 true),

(uuid_generate_v4(), 'User Testing and Iteration', 'Test with real users and iterate based on feedback', 'design_thinking', 5, 10,
 ARRAY['User testing protocols', 'Evaluation criteria', 'Iteration frameworks'],
 ARRAY['Test results', 'Iteration plans', 'Refined solutions'],
 ARRAY['Validated solutions', 'User acceptance', 'Clear iteration path'],
 ARRAY[(SELECT id FROM methodology_steps WHERE name = 'Rapid Prototyping')]::UUID[],
 '{"methods": ["user_testing", "feedback_analysis"], "metrics": ["usability", "acceptance"]}',
 true);

-- ==================================================
-- PROJECT SETUP SAMPLE DATA
-- ==================================================

-- Sample Research Project demonstrating multidisciplinary approach
INSERT INTO research_projects (id, title, description, status, principal_investigator_id, methodology_type, institutions, tags, metadata, created_at, updated_at) VALUES
(uuid_generate_v4(), 'AI-Enhanced Medical Image Analysis for Multidisciplinary Diagnosis', 
 'Development of an integrated system combining computer vision, psychology, and biomedical engineering to improve medical image analysis accuracy and interpretability',
 'active',
 (SELECT id FROM users WHERE email = 'researcher@medaix.edu' LIMIT 1), -- This will need actual user IDs
 'multidisciplinary_engineering',
 ARRAY['MedAIx University', 'Medical Research Institute'],
 ARRAY['artificial intelligence', 'medical imaging', 'multidisciplinary', 'healthcare'],
 '{"keywords": ["computer vision", "medical diagnosis", "human factors"], "expected_outcomes": ["improved diagnostic accuracy", "enhanced user experience"]}',
 CURRENT_TIMESTAMP,
 CURRENT_TIMESTAMP);

-- Link project to relevant disciplines
INSERT INTO project_disciplines (id, project_id, discipline_id, primary_discipline, contribution_level, created_at) VALUES
(uuid_generate_v4(),
 (SELECT id FROM research_projects WHERE title = 'AI-Enhanced Medical Image Analysis for Multidisciplinary Diagnosis'),
 (SELECT id FROM academic_disciplines WHERE code = 'ENG-CE-AI'),
 true,
 'primary',
 CURRENT_TIMESTAMP),
(uuid_generate_v4(),
 (SELECT id FROM research_projects WHERE title = 'AI-Enhanced Medical Image Analysis for Multidisciplinary Diagnosis'),
 (SELECT id FROM academic_disciplines WHERE code = 'PSY-HF'),
 false,
 'major',
 CURRENT_TIMESTAMP),
(uuid_generate_v4(),
 (SELECT id FROM research_projects WHERE title = 'AI-Enhanced Medical Image Analysis for Multidisciplinary Diagnosis'),
 (SELECT id FROM academic_disciplines WHERE code = 'ENG-BME'),
 false,
 'moderate',
 CURRENT_TIMESTAMP);

-- Link project to relevant ONET occupations
INSERT INTO project_occupations (id, project_id, occupation_id, relevance_level, role_description, created_at) VALUES
(uuid_generate_v4(),
 (SELECT id FROM research_projects WHERE title = 'AI-Enhanced Medical Image Analysis for Multidisciplinary Diagnosis'),
 (SELECT id FROM onet_occupations WHERE onet_code = '15-1252'),
 'high',
 'Lead software developer for AI system implementation',
 CURRENT_TIMESTAMP),
(uuid_generate_v4(),
 (SELECT id FROM research_projects WHERE title = 'AI-Enhanced Medical Image Analysis for Multidisciplinary Diagnosis'),
 (SELECT id FROM onet_occupations WHERE onet_code = '29-2032'),
 'high',
 'Medical imaging specialist providing domain expertise',
 CURRENT_TIMESTAMP),
(uuid_generate_v4(),
 (SELECT id FROM research_projects WHERE title = 'AI-Enhanced Medical Image Analysis for Multidisciplinary Diagnosis'),
 (SELECT id FROM onet_occupations WHERE onet_code = '15-2051'),
 'moderate',
 'Data scientist for model validation and performance analysis',
 CURRENT_TIMESTAMP);

-- ==================================================
-- KNOWLEDGE INTEGRATION EXAMPLES
-- ==================================================

-- Example knowledge integration showing cross-disciplinary synthesis
INSERT INTO knowledge_integrations (id, project_id, source_discipline_id, target_discipline_id, integration_type, title, description, source_knowledge, target_application, integration_method, validation_status, novelty_score, impact_potential, implementation_feasibility, created_by_id, created_at, updated_at) VALUES
(uuid_generate_v4(),
 (SELECT id FROM research_projects WHERE title = 'AI-Enhanced Medical Image Analysis for Multidisciplinary Diagnosis'),
 (SELECT id FROM academic_disciplines WHERE code = 'PSY-HF'),
 (SELECT id FROM academic_disciplines WHERE code = 'ENG-CE-AI'),
 'synthesis',
 'Human Factors-Driven AI Interface Design for Medical Imaging',
 'Application of human-computer interaction principles from psychology to improve AI system usability for medical professionals',
 'Human factors research shows that interface design significantly impacts diagnostic accuracy and user trust in AI systems',
 'AI medical imaging systems require interfaces that support human cognitive processes and build appropriate trust',
 'Integration through user-centered design principles applied to AI system development',
 'validated',
 0.85,
 'high',
 'high',
 (SELECT id FROM users WHERE email = 'researcher@medaix.edu' LIMIT 1),
 CURRENT_TIMESTAMP,
 CURRENT_TIMESTAMP);

-- ==================================================
-- COMPLETION MESSAGE
-- ==================================================

-- Verify data insertion
SELECT 
  (SELECT COUNT(*) FROM academic_disciplines) as academic_disciplines_count,
  (SELECT COUNT(*) FROM onet_occupations) as onet_occupations_count,
  (SELECT COUNT(*) FROM methodology_steps) as methodology_steps_count,
  (SELECT COUNT(*) FROM research_projects) as research_projects_count,
  (SELECT COUNT(*) FROM knowledge_integrations) as knowledge_integrations_count;
