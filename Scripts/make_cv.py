"""
Builds the CV page by embedding HTML created by pandoc into the master page.
The generated HTML is expected as input through stdin
"""

from global_vars import *
import sys

# read template files
with open(CVTemplatePath, 'r') as fin:
    cv_template = fin.read()
with open(MasterTemplatePath, 'r') as fin:
    m_template = fin.read()

# read from stdin
cv_body = sys.stdin.read()

# build page
m = templateSubN({
    'body': templateSubN({'cv_content': cv_body}, cv_template),
    'portfolio_active': '',
    'cv_active': 'active'
}, m_template)

# write to file
with open(CVOutputPath, 'w') as fout:
    fout.write(m)
