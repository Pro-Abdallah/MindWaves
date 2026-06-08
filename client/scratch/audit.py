import os
import re
import json

client_dir = r"d:\MindWaves\MindWaves\client"
src_dir = os.path.join(client_dir, "src")
assets_dir = os.path.join(client_dir, "Assets")
package_json_path = os.path.join(client_dir, "package.json")
index_html_path = os.path.join(client_dir, "index.html")

# Read all source files
src_files = []
for root, dirs, files in os.walk(src_dir):
    for f in files:
        if f.endswith(('.js', '.jsx', '.css', '.html', '.srt')):
            src_files.append(os.path.join(root, f))
src_files.append(index_html_path)

# Load file contents
file_contents = {}
for path in src_files:
    try:
        with open(path, 'r', encoding='utf-8') as f:
            file_contents[path] = f.read()
    except Exception as e:
        print(f"Could not read {path}: {e}")

# Read package.json
with open(package_json_path, 'r') as f:
    package_data = json.load(f)
dependencies = list(package_data.get("dependencies", {}).keys())

# --- 1. Audit Dependencies ---
print("--- AUDITING DEPENDENCIES ---")
unused_deps = []
for dep in dependencies:
    # Look for imports of this dependency
    # e.g., import ... from 'dep' or import 'dep' or require('dep')
    pattern = re.compile(rf"from\s+['\"]{dep}['\"]|import\s+['\"]{dep}['\"]|require\s*\(\s*['\"]{dep}['\"]")
    found = False
    for path, content in file_contents.items():
        if pattern.search(content):
            found = True
            break
    if not found:
        unused_deps.append(dep)
        print(f"Dependency '{dep}' seems UNUSED.")
    else:
        print(f"Dependency '{dep}' is used.")

# --- 2. Audit Assets ---
print("\n--- AUDITING ASSETS ---")
asset_files = []
for root, dirs, files in os.walk(assets_dir):
    for f in files:
        asset_files.append(os.path.join(root, f))

unused_assets = []
for asset_path in asset_files:
    rel_path = os.path.relpath(asset_path, assets_dir)
    # Check if the filename or relative path is in any code
    filename = os.path.basename(asset_path)
    # Clean version of filename / path to search
    normalized_rel = rel_path.replace("\\", "/")
    
    # We will search for:
    # 1. Exact normalized path: e.g. "popup_images/still_island.jpeg"
    # 2. Exact filename: e.g. "still_island.jpeg"
    # 3. For comic_story, they might be generated. Let's see if "comic_story" is referenced.
    # 4. For text_story/ride_the_waves, let's see if they are referenced.
    found = False
    for path, content in file_contents.items():
        if normalized_rel in content or filename in content:
            found = True
            break
        # Also check if it's dynamic, e.g. comic_story/
        if "comic_story" in normalized_rel and "comic_story" in content:
            found = True
            break
        if "popup_images" in normalized_rel and "popup_images" in content:
            # wait, it could be dynamic, but let's check specifically
            pass
            
    if not found:
        unused_assets.append(rel_path)
        print(f"Asset '{rel_path}' is UNUSED.")
    else:
        print(f"Asset '{rel_path}' is used.")

# --- 3. Audit Source Files (Unused files) ---
print("\n--- AUDITING SOURCE FILES (UNUSED FILES) ---")
# Let's list all files in src/ and see if they are imported/referenced in other files.
# Main entrypoints that are never "imported" but are entrypoints:
entrypoints = {
    os.path.join(src_dir, "main.jsx"),
    os.path.join(src_dir, "index.css"),
    os.path.join(src_dir, "App.jsx"),
    os.path.join(src_dir, "App.css"),
    os.path.join(src_dir, "routes.js")
}

unused_src_files = []
for src_file in src_files:
    if src_file == index_html_path or src_file in entrypoints:
        continue
    
    filename_no_ext = os.path.splitext(os.path.basename(src_file))[0]
    rel_path = os.path.relpath(src_file, client_dir)
    
    # Let's check if this file is imported/referenced in any OTHER file.
    # Typically: import ... from './path/to/filename_no_ext'
    # Or import './filename'
    found = False
    for other_path, content in file_contents.items():
        if other_path == src_file:
            continue
        # Search for filename_no_ext in import/require statements
        # We can also just search for filename_no_ext as a string in other files (excluding comments/etc is safer, but let's see)
        # In CSS, they are imported with @import or url().
        # Let's see if the base filename is in the other file.
        if filename_no_ext in content:
            # Let's double check if it's a real reference.
            # e.g., if it's in an import or relative path
            # Let's do a simple check. If it's there, we mark as found.
            found = True
            break
            
    if not found:
        unused_src_files.append(rel_path)
        print(f"Source file '{rel_path}' is UNUSED.")
    else:
        print(f"Source file '{rel_path}' is used.")
