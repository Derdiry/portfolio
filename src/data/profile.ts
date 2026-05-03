import type { Experience, Education, SkillGroup } from '@/types'

export const PROFILE = {
  name: 'Mohamed Alderdiry',
  title: 'Applied Machine Learning Engineer',
  location: 'Riyadh, Saudi Arabia',
  email: 'mod.derdiry@gmail.com',
  phone: '+966 570 126 493',
  linkedin: 'linkedin.com/in/mohamedalderdiry',
  github: 'github.com/mohamedalderdiry',
  bio: `Machine Learning Engineer with a Master's in Computer Science from Donghua University. I build production AI systems across computer vision, time series forecasting, and NLP/RAG, focusing on taking models from research to deployment.

I work on computer vision systems for agriculture and healthcare using Vision Transformers, ResNets, and EfficientNets. My experience includes transfer learning for specialized domains, large-scale geospatial platforms, and implementing model interpretability techniques like Grad-CAM for high-stakes domains.

For time series work, I built a 36-model ensemble benchmarking LSTM, GRU, TSMixer, PatchTST, Temporal Fusion Transformer, and Chronos. The most interesting finding: conflict event data from ACLED predicted commodity prices better than technical indicators in unstable markets. Post-coup regime change outranked everything else in the TFT's attention weights at a 30-day lag.

I've deployed a RAG application using LangChain and ChromaDB with hybrid BM25/vector search on Hugging Face Spaces. Built a model-agnostic serving platform with FastAPI, MLflow, and Docker for zero-code deployment with automated versioning and monitoring.

I'm also collaborating with petroleum engineers on an AI decision support system for pipeline integrity management. Academic papers in preparation.`,
  patent: {
    number: 'Australian Patent #2025203718',
    title: 'Innovative Image Processing Approach For Measuring Scar Tissue Extensibility',
    status: 'Accepted',
    role: 'Co-inventor',
  },
}

export const EXPERIENCE: Experience[] = [
  {
    id: 'sss',
    role: 'Applied Machine Learning Engineer',
    company: 'Super Smart Solutions',
    location: 'Riyadh, Saudi Arabia',
    startDate: '2024',
    endDate: 'Present',
    highlights: [
      'Developing an AI decision support system for pipeline integrity management — replacing Excel workflows with a 7-service Docker platform (FastAPI, React, PostgreSQL, MLflow, Celery) and a 16-step DSS engine with ML-corrected measurements',
      'Building computer vision systems for agricultural and healthcare applications using Vision Transformers, ResNets, and EfficientNets with transfer learning for specialized domains',
      'Implementing Grad-CAM explainability for high-stakes medical imaging models',
      'Designing model deployment infrastructure with FastAPI, MLflow, and Docker for zero-code model serving',
      'Co-inventor on Australian Patent #2025203718 for medical image processing',
    ],
  },
]

export const EDUCATION: Education[] = [
  {
    id: 'donghua',
    school: 'Donghua University',
    degree: "Master's",
    field: 'Computer Science',
    startYear: 2020,
    endYear: 2024,
    location: 'Shanghai, China',
    note: 'Research focus on deep learning and computer vision',
  },
  {
    id: 'sust',
    school: 'Sudan University of Science & Technology',
    degree: "Bachelor's",
    field: 'Management Information Systems',
    startYear: 2014,
    endYear: 2018,
    location: 'Khartoum, Sudan',
  },
]

export const SKILLS: SkillGroup[] = [
  {
    category: 'ML / AI',
    skills: [
      'PyTorch', 'TensorFlow / Keras', 'scikit-learn', 'XGBoost', 'LightGBM',
      'Hugging Face Transformers', 'LangChain', 'Optuna',
    ],
  },
  {
    category: 'Computer Vision',
    skills: [
      'Vision Transformers (ViT)', 'ResNet', 'EfficientNet',
      'Grad-CAM', 'Transfer Learning', 'Object Detection', 'Segmentation',
    ],
  },
  {
    category: 'NLP / RAG',
    skills: [
      'ChromaDB', 'FAISS', 'BM25', 'Sentence Transformers',
      'Semantic Search', 'Prompt Engineering', 'Claude API', 'Groq API',
    ],
  },
  {
    category: 'Time Series',
    skills: [
      'TSMixer', 'PatchTST', 'Temporal Fusion Transformer',
      'LSTM', 'GRU', 'Chronos', 'Walk-Forward Validation',
    ],
  },
  {
    category: 'Infrastructure / MLOps',
    skills: [
      'Docker', 'Docker Compose', 'MLflow', 'FastAPI', 'PostgreSQL',
      'Redis', 'Celery', 'Prometheus', 'Grafana', 'GitHub Actions', 'DVC',
    ],
  },
  {
    category: 'Frontend',
    skills: [
      'React', 'TypeScript', 'Tailwind CSS', 'Streamlit', 'Plotly',
      'Vite', 'Framer Motion',
    ],
  },
  {
    category: 'Data',
    skills: [
      'Pandas', 'NumPy', 'Matplotlib', 'SQLAlchemy', 'Alembic',
      'Jupyter', 'DVC', 'ACLED API', 'FRED API',
    ],
  },
]
