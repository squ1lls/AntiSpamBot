#!/usr/bin/env python
# coding: utf-8

# In[19]:

import pickle
from nltk.stem import PorterStemmer
ps = PorterStemmer()
import numpy as np
import re
from sklearn import preprocessing
from sklearn import svm
import flask
from flask import request, jsonify
from flask_cors import CORS, cross_origin
app = flask.Flask(__name__)
CORS(app)
# In[20]:






@app.route('/', methods=['GET'])
@cross_origin()
def home():
    features = np.load('/Users/william/features.npy')
    message = request.args.get('message')
    print(message)
    message.replace("%20", " ")
  

    # In[21]:


    words = np.load('/Users/william/words.npy')


    # In[22]:


    amount = np.load('/Users/william/amount.npy')


    # In[24]:


    filename = '/Users/william/final_model.sav'
    loaded_model = pickle.load(open(filename, 'rb'))


    # In[25]:


    #converts all to lowercase:
    message = message.lower()
    print(message)
    #stems all words
    s = ""
    temp = re.findall(r'\w+', message)
    for i in temp:
        s = s + ps.stem(i) + " "
    message = s


    # In[26]:


    temp = ([])
    for i in range(words.size):
        if words[i] in re.findall(r'\w+', message):
            temp = np.append(temp, [amount[i]])
        else:
            temp = np.append(temp, [0])
    features[0,:] = temp


    # In[27]:


    features = preprocessing.scale(features)


    # In[28]:

    output = loaded_model.predict(features[0:1,:])
    print(output[0])

    # In[ ]:



    
    lol=False
    if output[0] == "spam":
        return jsonify(
            isSpam=True
        )
    else:
        return jsonify(
            isSpam=False
        )

app.run()