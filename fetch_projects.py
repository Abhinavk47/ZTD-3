import json
import urllib.request
import os

# Replace this with your actual GitHub username
GITHUB_USERNAME = "Abhinavk47"

def fetch_github_repositories():
    url = f"https://api.github.com/users/{GITHUB_USERNAME}/repos?sort=updated&per_page=10"
    
    # Set up headers to prevent getting blocked by the API
    req = urllib.request.Request(
        url, 
        headers={'User-Agent': 'Python-Portfolio-Updater'}
    )
    
    try:
        print(f"Fetching repositories for user: {GITHUB_USERNAME}...")
        with urllib.request.urlopen(req) as response:
            repos = json.loads(response.read().decode())
            
        project_list = []
        for repo in repos:
            # We skip forks to only display original projects you built
            if repo.get('fork'):
                continue
                
            # Determine a fallback category tag based on the language
            lang = (repo.get('language') or 'Web').lower()
            category = 'code' if lang in ['python', 'c', 'java', 'cpp'] else 'web'
            if lang in ['figma', 'ui', 'ux']:
                category = 'design'

            project_data = {
                "title": repo.get('name'),
                "description": repo.get('description') or "A wonderful project built during my technical learning journey.",
                "category": category,
                "url": repo.get('html_url'),
                "language": repo.get('language') or "Mixed"
            }
            project_list.append(project_data)
            
        # Write out clean, pretty JSON data file
        with open('projects.json', 'w', encoding='utf-8') as f:
            json.dump(project_list, f, indent=4)
            
        print(f"Success! Saved {len(project_list)} projects to projects.json")

    except Exception as e:
        print(f"Error fetching data from API: {e}")

if __name__ == "__main__":
    fetch_github_repositories()