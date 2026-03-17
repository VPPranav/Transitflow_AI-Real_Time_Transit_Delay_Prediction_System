# AI Transit Delay Detection System

A comprehensive machine learning system for predicting public transport delays using historical data and real-time features.

## �� Project Overview

This project combines a FastAPI backend with a React frontend to provide an intelligent transit delay prediction system. The system uses machine learning models trained on historical public transport data to predict potential delays based on various features.

## �� Project Structure

```
ai_transit_delay_detection/
├── backend/                 # FastAPI backend API
│   ├── app.py              # Main FastAPI application
│   ├── check_features.py    # Feature validation utilities
│   ├── check_features2.py   # Additional feature validation
│   ├── check_joblib.py      # Joblib model validation
│   ├── delay_model.pkl      # Trained delay prediction model
│   ├── features.pkl         # Feature engineering model
│   ├── requirements.txt     # Python dependencies
│   └── out*.txt             # Output logs
├── dataset/                # Public transport data
│   └── public_transport_delays.csv
├── frontend/               # React frontend application
│   ├── src/
│   │   ├── components/      # React components
│   │   ├── lib/            # Utility functions
│   │   ├── pages/          # Page components
│   │   └── test/           # Test files
│   ├── public/             # Static assets
│   └── package.json        # Frontend dependencies
├── notebook/               # Jupyter notebooks
│   └── model_training.ipynb # Model training notebook
├── COMPLETE PROJECT PIPELINE.docx
└── README.md              # This file
```

## ��️ Technology Stack

### Backend
- **FastAPI**: High-performance web framework
- **Uvicorn**: ASGI server
- **Pandas**: Data manipulation
- **Scikit-learn**: Machine learning models
- **Pydantic**: Data validation
- **Joblib**: Model serialization

### Frontend
- **React**: UI library
- **TypeScript**: Type safety
- **Vite**: Build tool
- **Tailwind CSS**: Styling
- **Radix UI**: Component library
- **shadcn/ui**: Component library

## �� Getting Started

### Prerequisites
- Python 3.8+
- Node.js 16+
- npm or yarn

### Installation

#### Backend Setup
1. Navigate to the backend directory:
   ```bash
   cd backend
   ```

2. Install Python dependencies:
   ```bash
   pip install -r requirements.txt
   ```

#### Frontend Setup
1. Navigate to the frontend directory:
   ```bash
   cd frontend
   ```

2. Install Node.js dependencies:
   ```bash
   npm install
   ```

## �� Running the Application

### Backend
1. Start the FastAPI server:
   ```bash
   cd backend
   uvicorn app:app --reload
   ```

2. The API will be available at: http://localhost:8000

### Frontend
1. Start the development server:
   ```bash
   cd frontend
   npm run dev
   ```

2. The application will be available at: http://localhost:8080

## �� API Endpoints

- `GET /` - Health check
- `POST /predict` - Predict transit delays
- `GET /docs` - API documentation

## �� Configuration

### Environment Variables
Create a `.env` file in the backend directory:
```
DATABASE_URL=your_database_url
MODEL_PATH=./delay_model.pkl
```

## �� Dataset

The project uses public transport delay data stored in `dataset/public_transport_delays.csv`. The dataset includes:
- Historical delay records
- Route information
- Time-based features
- Weather conditions
- Traffic data

## �� Model Training

The machine learning model was trained using the Jupyter notebook `notebook/model_training.ipynb`. The training process includes:
- Data preprocessing
- Feature engineering
- Model selection
- Hyperparameter tuning
- Model evaluation

## �� Documentation

- **COMPLETE PROJECT PIPELINE.docx**: Full project documentation
- **PROJECT DOCUMENT.docx**: Project specifications and requirements

## �� Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Add tests if applicable
5. Submit a pull request

## �� License

This project is licensed under the MIT License - see the LICENSE file for details.

## �� Support

For support and questions:
- Create an issue in the repository
- Check the documentation files
- Review the API documentation at `/docs`

## �� Deployment

### Production
1. Build the frontend:
   ```bash
   cd frontend
   npm run build
   ```

2. Deploy the backend using your preferred method (Docker, cloud provider, etc.)

### Docker
A Dockerfile is available for container deployment:
```bash
docker build -t ai-transit-delay .
docker run -p 8000:8000 ai-transit-delay
```