import pickle
import traceback

with open('out_utf8.txt', 'w', encoding='utf-8') as f_out:
    try:
        with open('delay_model.pkl', 'rb') as f:
            model = pickle.load(f)
            if hasattr(model, 'feature_names_in_'):
                f_out.write(",".join(map(str, model.feature_names_in_)))
            else:
                f_out.write(f"No feature_names_in_. n_features: {getattr(model, 'n_features_in_', 'Unknown')}")
    except Exception as e:
        f_out.write(traceback.format_exc())
