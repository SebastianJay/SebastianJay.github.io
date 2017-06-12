# builds all the pages of the website
# dependencies: python 3.x, pandoc

python Scripts/make_portfolio.py
pandoc -w html -r markdown cv.md | python Scripts/make_cv.py
python Scripts/make_index.py
