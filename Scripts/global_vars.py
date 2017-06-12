"""
Contains some variables (paths) and utilities to be referenced by the other scripts
"""

MasterTemplatePath = 'templates/master.template.html'
PortfolioTemplatePath = 'templates/portfolio.template.html'
PortfolioItemTemplatePath = 'templates/portfolio-item.template.html'
PortfolioDataPath = 'portfolio.yml'
CVTemplatePath = 'templates/cv.template.html'
IndexTemplatePath = 'templates/index.template.html'

PortfolioOutputPath = 'portfolio.html'
CVOutputPath = 'cv.html'
IndexOutputPath = 'index.html'

import re
def templateSub(sid, repl, template):
    return re.sub(r'<!--\s*TEMPLATE:\s*{0}\s*-->'.format(sid), repl, template)
