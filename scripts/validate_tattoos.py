#!/usr/bin/env python3
"""
Tattoo Validation Script for Avalon/SpinForest
Validates tattoo JSON files to ensure proper structure and data integrity
"""

import json
import os
import sys
from pathlib import Path
from datetime import datetime

class TattooValidator:
    def __init__(self):
        self.errors = []
        self.warnings = []
        
    def validate_file(self, filepath):
        """Validate a single tattoo JSON file"""
        print(f"\n🔍 Validating: {filepath}")
        
        try:
            with open(filepath, 'r', encoding='utf-8') as f:
                data = json.load(f)
        except json.JSONDecodeError as e:
            self.errors.append(f"JSON parsing error in {filepath}: {e}")
            return False
        except FileNotFoundError:
            self.errors.append(f"File not found: {filepath}")
            return False
            
        # Validate top-level structure
        required_top = ['id', 'name', 'description', 'type']
        for field in required_top:
            if field not in data:
                self.errors.append(f"Missing required field '{field}' in {filepath}")
                
        # Validate tattoos array
        if 'tatouages' not in data:
            self.errors.append(f"Missing 'tatouages' array in {filepath}")
            return False
            
        tattoos = data['tatouages']
        if not isinstance(tattoos, list):
            self.errors.append(f"'tatouages' must be an array in {filepath}")
            return False
            
        # Validate each tattoo
        required_tattoo_fields = ['id', 'location', 'texte', 'date_apparition', 'signification']
        tattoo_ids = []
        
        for i, tattoo in enumerate(tattoos):
            # Check required fields
            for field in required_tattoo_fields:
                if field not in tattoo:
                    self.errors.append(
                        f"Tattoo #{i} missing required field '{field}' in {filepath}"
                    )
                    
            # Validate date format
            if 'date_apparition' in tattoo:
                try:
                    datetime.strptime(tattoo['date_apparition'], '%Y-%m-%d')
                except ValueError:
                    self.warnings.append(
                        f"Tattoo '{tattoo.get('id', i)}' has invalid date format "
                        f"(expected YYYY-MM-DD): {tattoo['date_apparition']}"
                    )
                    
            # Check for duplicate IDs
            if 'id' in tattoo:
                if tattoo['id'] in tattoo_ids:
                    self.errors.append(f"Duplicate tattoo ID '{tattoo['id']}' in {filepath}")
                tattoo_ids.append(tattoo['id'])
                
            # Optional: validate importance level
            if 'niveau_importance' in tattoo:
                if tattoo['niveau_importance'] not in ['bas', 'moyen', 'haut', 'critique']:
                    self.warnings.append(
                        f"Tattoo '{tattoo.get('id', i)}' has non-standard importance level: "
                        f"{tattoo['niveau_importance']}"
                    )
                    
            # Optional: validate status
            if 'status' in tattoo:
                valid_statuses = ['actif', 'dormant', 'effacé', 'corrompu', 'en_evolution']
                if tattoo['status'] not in valid_statuses:
                    self.warnings.append(
                        f"Tattoo '{tattoo.get('id', i)}' has non-standard status: "
                        f"{tattoo['status']}"
                    )
                    
        return len(self.errors) == 0
        
    def print_report(self):
        """Print validation report"""
        print("\n" + "="*60)
        print("📋 VALIDATION REPORT")
        print("="*60)
        
        if not self.errors and not self.warnings:
            print("✅ All validations passed!")
        else:
            if self.errors:
                print(f"\n❌ ERRORS ({len(self.errors)}):")
                for error in self.errors:
                    print(f"   - {error}")
                    
            if self.warnings:
                print(f"\n⚠️  WARNINGS ({len(self.warnings)}):")
                for warning in self.warnings:
                    print(f"   - {warning}")
                    
        print("\n" + "="*60)
        

def main():
    """Main validation function"""
    validator = TattooValidator()
    
    # Define tattoo file paths
    tattoo_files = [
        "AVALON/💠 Essences scellées/🪙Artefacts/mineurs/tatouages_memento_archiviste.json",
        "AVALON/💠 Essences scellées/🪙Artefacts/mineurs/tatouages_memento_archiviste_recursifs.json"
    ]
    
    # Add any additional tattoo files found
    for pattern in ["**/tattoo*.json", "**/tatouage*.json"]:
        for path in Path(".").rglob(pattern):
            if str(path) not in tattoo_files and "node_modules" not in str(path):
                tattoo_files.append(str(path))
    
    print("🎯 Tattoo Validation Script")
    print(f"📁 Found {len(tattoo_files)} tattoo files to validate")
    
    # Validate each file
    valid_count = 0
    for filepath in tattoo_files:
        if os.path.exists(filepath):
            if validator.validate_file(filepath):
                valid_count += 1
        else:
            validator.warnings.append(f"Referenced file not found: {filepath}")
    
    # Print final report
    validator.print_report()
    print(f"\n📊 Summary: {valid_count}/{len(tattoo_files)} files valid")
    
    # Return exit code
    return 0 if len(validator.errors) == 0 else 1


if __name__ == "__main__":
    sys.exit(main())