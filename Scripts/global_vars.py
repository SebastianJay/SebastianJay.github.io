"""
Contains some variables (paths) and utilities to be referenced by the other scripts
"""

MasterTemplatePath = 'templates/master.template.html'
PortfolioTemplatePath = 'templates/portfolio.template.html'
PortfolioItemTemplatePath = 'templates/portfolio-item.template.html'
PortfolioDataPath = 'portfolio.yml'
CVTemplatePath = 'templates/cv.template.html'
IndexTemplatePath = 'templates/index.template.html'
BuildDirectories = [    # subdirectories for each web build
    'Bounce',
    'CubeWorld',
    'MusicVisual',
    'YeahMusic',
]
BuildTemplatePath = 'templates/build.template.html' # master template
BuildSubTemplatePath = 'index.template.html'   # found in each subdirectory

PortfolioOutputPath = 'portfolio.html'
CVOutputPath = 'cv.html'
IndexOutputPath = 'index.html'
BuildOutputPath = 'index.html'  # for each subdirectory

import re
def templateSub(sid, repl, template):
    return re.sub(r'<!--\s*TEMPLATE:\s*{0}\s*-->'.format(sid), str(repl), template)

def templateSubN(dct, template):
    final = template
    for key in dct:
        final = templateSub(key, dct[key], final)
    return final
