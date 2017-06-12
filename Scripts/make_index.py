"""
Builds the index page by embedding the static page content into the master page
"""

from global_vars import *

# read template files
with open(IndexTemplatePath, 'r') as fin:
    index_template = fin.read()
with open(MasterTemplatePath, 'r') as fin:
    m_template = fin.read()

# build page
index = templateSub('body', index_template,
    templateSub('portfolio_active', '',
    templateSub('cv_active', '', m_template)))

# write to file
with open(IndexOutputPath, 'w') as fout:
    fout.write(index)
