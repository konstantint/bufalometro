from setuptools import setup, find_packages
from bufalometro.config import __version__

setup(name='Bufalometro',
      version=__version__,
      packages=find_packages(),
      install_requires=['flask', 'sklearn', 'google', 'numpy'],
      description="Bufalometro is a half-serious app for natural language analysis in the context of fake news detection",
      long_description=open("README.rst").read(),
      url='https://github.com/konstantint/bufalometro',
      author='Konstantin Tretyakov',
      author_email='kt@ut.ee',
      license='MIT',
      include_package_data=True,
      zip_safe=False,
      classifiers=[  # Get strings from http://pypi.python.org/pypi?%3Aaction=list_classifiers
          'Development Status :: 7 - Inactive',
          'Intended Audience :: Science/Research',
          'License :: OSI Approved :: MIT License',
          'Operating System :: OS Independent',
          'Programming Language :: Python :: 3',
          'Framework :: Flask',
          'Natural Language :: Italian',
      ],
)
