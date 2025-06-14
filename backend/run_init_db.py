#!/usr/bin/env python3
"""
Simple script to run the database initialization
"""

import sys
import os

# Add the current directory to Python path
sys.path.insert(0, os.path.dirname(os.path.abspath(__file__)))

# Import and run the initialization
from init_db import main

if __name__ == "__main__":
    main()
