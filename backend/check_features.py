import pickle

with open('features.pkl', 'rb') as f:
    features = pickle.load(f)

print(features)
