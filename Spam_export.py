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


# In[20]:


features = np.load('/Users/danielgeorge/features.npy')
message = ""


# In[21]:


words = np.load('/Users/danielgeorge/words.npy')


# In[22]:


amount = np.load('/Users/danielgeorge/amount.npy')


# In[24]:


filename = '/Users/danielgeorge/Documents/final_model.sav'
loaded_model = pickle.load(open(filename, 'rb'))


# In[25]:


#converts all to lowercase:
message = message.lower()
    
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


print(loaded_model.predict(features[0:1,:]))


# In[ ]:




