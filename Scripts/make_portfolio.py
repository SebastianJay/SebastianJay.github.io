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
  <div class="dropdown-menu">\
    <!-- TEMPLATE: category_items -->\
  </div>\
</li>'
nav_item_template = '<a id="link-<!-- TEMPLATE: item_id -->" class="nav-link" href="#"><!-- TEMPLATE: item_title --></a>'
action_button_template = '<button type="button" class="btn btn-primary" data-toggle="tooltip" title="<!-- TEMPLATE: button_tooltip -->"><i class="fa <!-- TEMPLATE: button_icon -->" aria-hidden="true"></i></button>'
image_slide_template = '<div class="carousel-item <!-- TEMPLATE: slide_active -->">\
  <img class="d-block img-fluid" src="<!-- TEMPLATE: slide_src -->" alt="image slide">\
</div>'
youtube_slide_template = '<div class="carousel-item embed-responsive embed-responsive-16by9 <!-- TEMPLATE: slide_active -->">\
  <iframe id="player-<!-- TEMPLATE: item_id -->-<!-- TEMPLATE: player_num -->" class="youtube-iframe" type="text/html"\
   src="<!-- TEMPLATE: slide_src -->?enablejsapi=1&rel=0" frameborder="0" allowfullscreen></iframe>\
</div>'
#&origin=https://sebastianjay.github.io

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
    nav_item = templateSub('item_title', item['title'], templateSub('item_id', str(item_counter), nav_item_template))
    nav_snippets[item['category']].append(nav_item)

    # action buttons
    action_buttons = []
    for action in item['resources']:
        if action['type'] in list(fa_icons.keys()):
            action_buttons.append(templateSub('button_icon', fa_icons[action['type']],
                templateSub('button_tooltip', action['tooltip'] if 'tooltip' in action else tooltip_defaults[action['type']], action_button_template)))

    # carousel slides
    carousel_slides = []
    player_count = 0
    for slide in item['resources']:
        slide_active = 'active' if len(carousel_slides) == 0 else ''
        if slide['type'] == 'image':
            carousel_slides.append(templateSub('slide_src', slide['link'],
                templateSub('slide_active', slide_active, image_slide_template)))
        elif slide['type'] == 'youtube':
            carousel_slides.append(templateSub('slide_src', slide['link'],
                templateSub('slide_active', slide_active,
                templateSub('item_id', str(item_counter),
                templateSub('player_num', str(player_count), youtube_slide_template)))))
            player_count += 1

    # create the portfolio item
    p_item = templateSub('item_carousel_slides', '\n'.join(carousel_slides),
        templateSub('item_buttons', '\n'.join(action_buttons),
        templateSub('item_description', item['description'],
        templateSub('item_subtitle', item['subtitle'],
        templateSub('item_title', item['title'],
        templateSub('item_id', str(item_counter), p_item_template))))))

    # save snippet and inc id counter
    items.append(p_item)
    item_counter += 1

# construct nav
nav = ''
for category in p_data['categories']:
    nav_list = '\n'.join(nav_snippets[category['id']])
    nav += templateSub('category_items', nav_list,
        templateSub('category_name', category['name'], nav_category_template)) + '\n'

# build whole page
p = templateSub('portfolio_items', '\n'.join(items),
    templateSub('nav_links', nav, p_template))
m = templateSub('body', p,
    templateSub('portfolio_active', 'active',
    templateSub('cv_active', '', m_template)))

# write to file
with open(PortfolioOutputPath, 'w') as fout:
    fout.write(m)
