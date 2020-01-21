# sebastianjay.github.io [![Build Status](https://travis-ci.com/SebastianJay/SebastianJay.github.io.svg?branch=source)](https://travis-ci.com/SebastianJay/SebastianJay.github.io)

This is the repo for my [portfolio website](https://sebastianjay.github.io), which is deployed on GitHub Pages. The webpages are built with my own simple templating system, where HTML comments are interpreted by Python scripts and replaced with the appropriate generated HTML snippets. This system gets particularly involved with the portfolio page, which uses a YAML file to create the various items, and the CV page, which uses a Markdown file which is then converted to HTML using [Pandoc](https://pandoc.org/). The other pages are relatively straightforward. If you're just looking for Markdown to HTML automation, [Jekyll](https://github.com/jekyll/jekyll) will be a better solution for you; if you're looking for a portfolio generated from YAML data (similar to [what I created](https://sebastianjay.github.io/portfolio.html)), consider adapting my code.

Travis CI is responsible for picking up changes from the `source` branch, running the build scripts (Bash and Python located under the `Scripts` directory) that convert the template HTML (i.e. those files ending in `template.html`) and data files into static HTML, [and pushing those files to `master`](https://docs.travis-ci.com/user/deployment/pages/), which GitHub Pages then builds from (note that [GitHub User pages must be built from `master`](https://stackoverflow.com/a/25561859)).

### Dependencies

This project has a couple dependencies in order to build the full set of pages:

* [Python 3](https://www.python.org/downloads/) -- I used version 3.6.1 but in theory any flavor of 3 should work.
* [PyYAML](https://pypi.python.org/pypi/PyYAML) -- Can be installed via `pip install pyyaml`. Needed to create the portfolio page.
* [Pandoc](https://pandoc.org/) -- Needed to create the CV page.
* Bash -- on Windows there are many ways to get about this: Git Bash, MinGW, Linux subsystem, Cygwin... this is only needed to run `Scripts/build_site.sh`, which is rather short and can be easily rewritten as a Windows shell script.

Look at the `.travis.yml` file to see how these are pulled onto the build agent.

### Workflow

Webpages are built from template files which are glued together via Python scripts. A template file is just HTML that has some extra markup in the form of comments that take the form:

```
<!-- TEMPLATE: var_name -->
```

Where `var_name` can be any string. A Python script can then locate this markup using `var_name` and replace it with HTML in a context-sensitive manner, using the `templateSubN` utility (a simple regex match/replace) located in `Scripts/global_vars.py`. Take a look at `Scripts/make_index.py` for a simple case (the master template, which has the navbar common to all pages, embeds some inner HTML), and `Scripts/make_portfolio.py` for a complex case (templates embedding other templates).

To build the site, run `bash Scripts/build_site.sh`, which will then invoke each of the Python scripts in the `Scripts` folder. A couple notes:

* All the configuration of input and output paths is kept in `Scripts/global_vars.py`.
* My original intent of using HTML comments as markup was that the markup would be harmless if it was not replaced. However, oftentimes I need to use markup in HTML strings (e.g. to add a CSS class to an element); in this case the markup actually would have an impact if it was not replaced. For this reason, generator scripts need to be careful to replace all the markup present in the template, even if some variables are just empty strings. An alternate solution for those adapting this project may be to post-process the generated files and strip out any unused markup comments.
* The CV generator script needs HTML generated from Pandoc as input through stdin.
* The portfolio generator script has many template snippets as string literals in the code -- we did this just for convenience to avoid having too many files under the `templates` folder.
* The build pages generator will create multiple files according to the length of `BuildInfo` in `Scripts/global_vars.py`.
