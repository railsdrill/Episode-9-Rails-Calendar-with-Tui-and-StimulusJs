json.extract! schedule, :id, :title, :start, :end, :calendar_id, :created_at, :updated_at
json.url schedule_url(schedule, format: :json)
