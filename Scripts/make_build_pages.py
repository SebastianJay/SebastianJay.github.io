"""
Creates a series of pages for the web builds of certain portfolio items
"""

from global_vars import *
import os.path

# read templates
with open(BuildTemplatePath, 'r') as fin:
    build_template = fin.read()
with open(MasterTemplatePath, 'r') as fin:
    m_template = fin.read()

# go through each of the web builds
for directory in BuildDirectories:    
    # read the inner content
    with open(os.path.join(directory, BuildSubTemplatePath), 'r') as fin:
        build_sub_template = fin.read()

    # build the page
    build = templateSub('body', templateSub('build_content', build_sub_template, build_template),
            templateSub('portfolio_active', 'active',
            templateSub('cv_active', '', m_template)))

    # write the file
    with open(os.path.join(directory, BuildOutputPath), 'w') as fout:
        fout.write(build)
