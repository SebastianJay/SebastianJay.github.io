"""
Contains some variables (paths) and utilities to be referenced by the other scripts
"""

MasterTemplatePath = 'templates/master.template.html'
PortfolioTemplatePath = 'templates/portfolio.template.html'
PortfolioItemTemplatePath = 'templates/portfolio-item.template.html'
PortfolioDataPath = 'portfolio.yml'
CVTemplatePath = 'templates/cv.template.html'
IndexTemplatePath = 'templates/index.template.html'
BuildTemplatePath = 'templates/build.template.html' # master template for all build pages
BuildInfo = [   # for each build, (readable name, subtemplate path, output path) string tuple
    ('Cakewalk', 'templates/cakewalk.template.html', 'builds/Cakewalk/index.html'),
    ('CubeWorld', 'templates/cubeworld.template.html', 'builds/CubeWorld/index.html'),
    ('Neural Music', 'templates/neuralmusic.template.html', 'builds/NeuralMusic/index.html'),
    ('Yeah Music', 'templates/yeahmusic.template.html', 'builds/YeahMusic/index.html')
]
PortfolioOutputPath = 'portfolio.html'
CVOutputPath = 'cv.html'
IndexOutputPath = 'index.html'

import re
def templateSub(sid, repl, template):
    return re.sub(r'<!--\s*TEMPLATE:\s*{0}\s*-->'.format(sid), str(repl), template)

def templateSubN(dct, template):
    final = template
    for key in dct:
        final = templateSub(key, dct[key], final)
    return final
