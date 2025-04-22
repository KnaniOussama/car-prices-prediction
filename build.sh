#!/bin/bash
pip install --upgrade pip
pip uninstall -y numpy
pip install numpy==1.26.4
pip install -r requirements.txt