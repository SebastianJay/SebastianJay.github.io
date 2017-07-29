"""
Creates a series of pages for the web builds of certain portfolio items
"""

from global_vars import *

# read templates
with open(BuildTemplatePath, 'r') as fin:
    build_template = fin.read()
with open(MasterTemplatePath, 'r') as fin:
    m_template = fin.read()

# go through each of the web builds
for name, subpath, outpath in BuildInfo:
    # read the inner content
    with open(subpath, 'r') as fin:
        build_sub_template = fin.read()

    # build the page
    build = templateSubN({
        'body': templateSubN({'build_content': build_sub_template}, build_template),
        'portfolio_active': 'active',
        'cv_active': '',
        'path_prefix': '../',
        'title': name
    }, m_template)

    # write the file
    with open(outpath, 'w') as fout:
        fout.write(build)
