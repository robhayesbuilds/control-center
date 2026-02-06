#!/bin/bash
# Log an activity to Mission Control
# Usage: ./log-activity.sh <type> <title> [description] [category] [project]

DATA_DIR="${DATA_DIR:-/home/openclaw/.openclaw/workspace/control-center/data}"
ACTIVITIES_FILE="$DATA_DIR/activities.json"

TYPE="${1:-unknown}"
TITLE="${2:-Untitled}"
DESCRIPTION="${3:-}"
CATEGORY="${4:-system}"
PROJECT="${5:-}"

# Ensure data directory exists
mkdir -p "$DATA_DIR"

# Create activities file if doesn't exist
if [ ! -f "$ACTIVITIES_FILE" ]; then
  echo "[]" > "$ACTIVITIES_FILE"
fi

# Generate activity JSON
TIMESTAMP=$(date +%s)000
ID="act_${TIMESTAMP}_$(cat /dev/urandom | tr -dc 'a-z0-9' | fold -w 6 | head -n 1)"

# Create the activity entry
ACTIVITY=$(cat <<EOF
{
  "id": "$ID",
  "timestamp": $TIMESTAMP,
  "type": "$TYPE",
  "title": "$TITLE",
  "description": "$DESCRIPTION",
  "category": "$CATEGORY",
  "project": "$PROJECT",
  "status": "completed"
}
EOF
)

# Prepend to activities array using Python (more reliable than jq for JSON)
python3 << PYTHON
import json
import sys

activity = $ACTIVITY

try:
    with open('$ACTIVITIES_FILE', 'r') as f:
        activities = json.load(f)
except:
    activities = []

activities.insert(0, activity)

# Keep only last 10000
activities = activities[:10000]

with open('$ACTIVITIES_FILE', 'w') as f:
    json.dump(activities, f, indent=2)

print(f"Logged: {activity['title']}")
PYTHON
