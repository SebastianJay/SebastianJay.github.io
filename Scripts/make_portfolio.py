"""
Builds the portfolio page by interpolating YAML data into the template files
"""

from global_vars import *
import yaml

# read data and template files
with open(PortfolioDataPath, 'r') as fin:
    p_data = yaml.load(fin.read())
with open(PortfolioTemplatePath, 'r') as fin:
    p_template = fin.read()
with open(PortfolioItemTemplatePath, 'r') as fin:
    p_item_template = fin.read()
with open(MasterTemplatePath, 'r') as fin:
    m_template = fin.read()

# inline short template strings that we don't bother to put into separate files
nav_category_template = '<li class="nav-item dropdown">\
  <a class="nav-link dropdown-toggle" data-toggle="dropdown" href="#" role="button" aria-haspopup="true" aria-expanded="false"><!-- TEMPLATE: category_name --></a>\
  <div class="dropdown-menu <!-- TEMPLATE: category_dropdown_type -->">\
    <!-- TEMPLATE: category_items -->\
  </div>\
</li>'
nav_item_template = '<a id="link-<!-- TEMPLATE: item_id -->" class="nav-link" href="#"><!-- TEMPLATE: item_title --></a>'
action_button_template = '<a href="<!-- TEMPLATE: button_link -->" target="<!-- TEMPLATE: button_target -->" class="btn btn-primary" data-toggle="tooltip" title="<!-- TEMPLATE: button_tooltip -->">\
<i class="fa <!-- TEMPLATE: button_icon -->" aria-hidden="true"></i></a>'
image_slide_template = '<div class="carousel-item <!-- TEMPLATE: slide_active -->">\
  <img class="d-block img-fluid" src="<!-- TEMPLATE: slide_src -->" alt="image slide">\
</div>'
youtube_slide_template = '<div class="carousel-item embed-responsive embed-responsive-16by9 <!-- TEMPLATE: slide_active -->">\
  <iframe id="player-<!-- TEMPLATE: item_id -->-<!-- TEMPLATE: player_num -->" class="youtube-iframe" type="text/html"\
   src="<!-- TEMPLATE: slide_src -->?enablejsapi=1&rel=0&origin=https://sebastianjay.github.io" frameborder="0" allowfullscreen></iframe>\
</div>'

fa_icons = {
    'github': 'fa-github',
    'external': 'fa-external-link',
    'download': 'fa-download',
    'play': 'fa-gamepad'
}
tooltip_defaults = {
    'github': 'Fork on GitHub',
    'external': 'View Site',
    'download': 'Download Project',
    'play': 'Play Game'
}

# initialize navigation links
nav_snippets = {}
for category in p_data['categories']:
    nav_snippets[category['id']] = []

# iterate through each portfolio item and generate snippets for each
item_counter = 0
items = []
for item in p_data['items']:
    # create the navigation link
    nav_item = templateSubN({
        'item_title': item['title'],
        'item_id': item_counter
    }, nav_item_template)
    nav_snippets[item['category']].append(nav_item)

    # action buttons
    action_buttons = []
    for action in item['resources']:
        if action['type'] in list(fa_icons.keys()):
            action_buttons.append(templateSubN({
                'button_icon': fa_icons[action['type']],
                'button_link': action['link'],
                'button_target': '_blank' if action['type'] not in ['download', 'play'] else '_self',
                'button_tooltip': action['tooltip'] if 'tooltip' in action else tooltip_defaults[action['type']]
            }, action_button_template))

    # carousel slides
    carousel_slides = []
    player_count = 0
    for slide in item['resources']:
        slide_active = 'active' if len(carousel_slides) == 0 else ''
        if slide['type'] == 'image':
            carousel_slides.append(templateSubN({
                'slide_src': slide['link'],
                'slide_active': slide_active
            }, image_slide_template))
        elif slide['type'] == 'youtube':
            carousel_slides.append(templateSubN({
                'slide_src': slide['link'],
                'slide_active': slide_active,
                'item_id': item_counter,
                'player_num': player_count
            }, youtube_slide_template))
            player_count += 1

    # create the portfolio item
    p_item = templateSubN({
        'item_carousel_slides': '\n'.join(carousel_slides),
        'item_buttons': '\n'.join(action_buttons),
        'item_description': item['description'],
        'item_subtitle': item['subtitle'],
        'item_title': item['title'],
        'item_id': item_counter
    }, p_item_template)

    # save snippet and inc id counter
    items.append(p_item)
    item_counter += 1

# construct nav
nav = ''
category_counter = 0
for category in p_data['categories']:
    nav_list = '\n'.join(nav_snippets[category['id']])
    nav += templateSubN({
        'category_items': nav_list,
        'category_name': category['name'],
        'category_dropdown_type': 'dropdown-menu-right' if category_counter == len(p_data['categories']) - 1 else ''
    }, nav_category_template) + '\n'
    category_counter += 1

# build whole page
p = templateSubN({
    'portfolio_items': '\n'.join(items),
    'nav_links': nav
}, p_template)
m = templateSubN({
    'body': p,
    'portfolio_active': 'active',
    'cv_active': '',
    'path_prefix': '',
    'title': 'Portfolio'
}, m_template)

# write to file
with open(PortfolioOutputPath, 'w') as fout:
    fout.write(m)
