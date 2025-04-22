#!/bin/bash
pip install --upgrade pip
pip uninstall -y numpy
pip install numpy==1.25.2
pip install -r requirements.txt