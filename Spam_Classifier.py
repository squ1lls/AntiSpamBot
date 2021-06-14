#!/usr/bin/env python
# coding: utf-8

# In[84]:


from nltk.stem import PorterStemmer
ps = PorterStemmer()
import numpy as np
import pandas as pd
import re
from sklearn import preprocessing
values = pd.read_csv('/Users/William/spam_2.csv',encoding='latin-1')
from sklearn import svm
clf = svm.SVC(C=1)
import sklearn
import joblib


# In[85]:


values.head()


# In[86]:


#converts all to lowercase:

for value in range(values["v2"].size):
    values["v2"][value] = values["v2"][value].lower()
    
#stems all words e.g. running = run:

for value in range(values["v2"].size):
    s = ""
    temp = re.findall(r'\w+', values["v2"][value])
    for i in temp:
        s = s + ps.stem(i) + " "
    values["v2"][value] = s

#unique words put in wordList:

words = np.array([])
amount = np.array([])
count = 0

for i in range(values["v2"].size):
    if(values["v1"][i] == 'spam'):
        count = count+1
        test = re.findall(r'\w+', values["v2"][i])
        for value in test:
            if value in words:
                result = np.where(words == value)
                amount[result[0][0]] = amount[result[0][0]]+1
            else:
                words = np.append(words, [value])
                amount = np.append(amount, [1])

total = np.concatenate([words, amount])
print(count)


# In[87]:


words.size


# In[88]:


#splits train and test sets where test is 1/3 of set and train is 2/3:

from sklearn.model_selection import train_test_split
X_train, X_test, y_train, y_test = train_test_split(values["v2"],values["v1"] , test_size=0.33, random_state=42)

X_train = X_train.to_numpy()
X_test = X_test.to_numpy()
y_train = y_train.to_numpy()
y_test = y_test.to_numpy()


# In[89]:


#find all unique words that have more than 10 occurances:

wordsupdated = np.array([])
amountupdated = np.array([])

for value in range(words.size):
    if(amount[value] >=10):
        wordsupdated = np.append(wordsupdated, [words[value]])
        amountupdated = np.append(amountupdated, [amount[value]])


# In[90]:


#converting each email into a feature vector which is basically a vector that stores amountupdated if it has a certain word in wordsupdated and 0 if not:

features = np.zeros((X_train.size, wordsupdated.size))

for value in range(X_train.size):
    temp = ([])
    for i in range(wordsupdated.size):
        if wordsupdated[i] in re.findall(r'\w+', X_train[value]):
            temp = np.append(temp, [amountupdated[i]])
        else:
            temp = np.append(temp, [0])
    features[value,:] = temp


# In[91]:


#feature vectors for test set

featurestest = np.zeros((X_test.size, wordsupdated.size))

for value in range(X_test.size):
    temp = ([])
    for i in range(wordsupdated.size):
        if wordsupdated[i] in re.findall(r'\w+', X_test[value]):
            temp = np.append(temp, [amountupdated[i]])
        else:
            temp = np.append(temp, [0])
    featurestest[value,:] = temp


# In[92]:


#scales feature vectors so it is not dramatically impacted by one feature

features = preprocessing.scale(features)
featurestest = preprocessing.scale(featurestest)
clf.fit(features, y_train)


# In[93]:


#predicts the test set to see accuracy

predictions = clf.predict(featurestest[:,:])


# In[94]:


#calculate the accuracy, recall, and precision of the testset and prints it

tp = 0
tn = 0
fp = 0
fn = 0

for i in range(y_test.size):
    if(y_test[i] == predictions[i]):
        if(y_test[i] == 'spam'):
            tp = tp + 1
        else:
            tn = tn + 1
    else:
        if(y_test[i] == 'spam'):
            fp = fp +1
        else:
            fn = fn +1


recall = tp/(tp + fn)
accuracy = (tp+tn)/(tp + fp + tn + fn)
precision = tp/(tp + fp)

print(recall)
print(accuracy)
print(precision)


# In[95]:


#save model on my computer

import pickle
filename = 'final_model.sav'
pickle.dump(clf,open(filename, 'wb'))

