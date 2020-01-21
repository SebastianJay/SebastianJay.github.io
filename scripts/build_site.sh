# builds all the pages of the website
# dependencies: python 3.x, pandoc

python scripts/make_portfolio.py
pandoc -w html -r markdown cv.md | python scripts/make_cv.py
python scripts/make_index.py
python scripts/make_build_pages.py
