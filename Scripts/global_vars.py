"""
Contains some variables (paths) and utilities to be referenced by the other scripts
"""

MasterTemplatePath = 'master.template.html'
PortfolioTemplatePath = 'portfolio.template.html'
PortfolioItemTemplatePath = 'portfolio-item.template.html'
PortfolioDataPath = 'portfolio.yml'

PortfolioOutputPath = 'portfolio.html'

import re
def templateSub(sid, repl, template):
    return re.sub(r'<!--\s*TEMPLATE:\s*{0}\s*-->'.format(sid), repl, template)
