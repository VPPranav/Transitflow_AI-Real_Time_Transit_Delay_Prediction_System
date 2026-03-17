import joblib
import traceback

with open('out_joblib.txt', 'w', encoding='utf-8') as f_out:
    try:
        features = joblib.load('features.pkl')
        model = joblib.load('delay_model.pkl')
        
        f_out.write(f"Features type: {type(features)}\n")
        f_out.write(f"Features: {features}\n")
        
        f_out.write(f"\nModel type: {type(model)}\n")
        if hasattr(model, 'feature_names_in_'):
            f_out.write(f"Model feature_names_in_: {list(model.feature_names_in_)}\n")
    except Exception as e:
        f_out.write(traceback.format_exc())
