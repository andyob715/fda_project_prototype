#!/usr/bin/env python
# coding: utf-8

# In[1]:


# Dependencies
import json
import requests
import pandas as pd
from IPython.display import Javascript
import matplotlib.pyplot as plt

# from config import api_key


# In[2]:


# Save config information

url = "https://api.fda.gov/food/enforcement.json?limit="
limit = 1000

# Build query URL
query_url = f'{url}{limit}'

query_url


# In[3]:


# Get fda data
fda_response = requests.get(query_url)
fdaresponse = fda_response.json()

fdaresponse.keys()


# In[4]:


fdaresponse['results']


# In[5]:


df = pd.DataFrame(fdaresponse['results'])
df


# In[6]:


fda = df[['city', 'address_1', 'state', 'recalling_firm', 'recall_number', 'initial_firm_notification', 'event_id', 'recall_initiation_date', 'postal_code', 'voluntary_mandated', 'status']]
fda


# In[7]:


fda.rename(columns={'address_1':'address'})
fda


# In[8]:


fda['initial_firm_notification'].unique()


# In[9]:


fda.loc[fda['initial_firm_notification'].str.contains('Two', na=False, case=False), 'initial_firm_notification'] = 'Multiple'
fda['initial_firm_notification'].unique()


# In[10]:


# notices = pd.DataFrame(fda['initial_firm_notification'].value_counts().reset_index()).rename(columns={"index":"Type", 'initial_firm_notification':"Count"})
# y = notices['Count']
# mylabels = ['Letter', 'Multiple', 'Visit', 'Press Release', 'Telephone',
#        'E-Mail', 'Other', 'FAX']
# colors = ['thistle', 'salmon', 'peachpuff', 'darkseagreen', 'powderblue', 'papayawhip', 'lavender', 'orchid']

# patches, texts = plt.pie(y, labels = mylabels, colors = colors, autopct = '%1.1f%%', shadow=True, startangle=65, radius = 1.2)
# plt.title("Initial Notices")
# plt.axis('equal')
# sort_legend = False
# plt.legend(patches, labels=mylabels, loc='left center', bbox_to_anchor=(-0.1, 1.),
#            fontsize=8)
# plt.savefig('Images/initial_notice_pie.png', bbox_inches='tight')


# In[ ]:




