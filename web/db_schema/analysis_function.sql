-- Function to calculate course statistics
-- Usage: select * from get_course_statistics('course_uuid');

create or replace function get_course_statistics(p_course_id uuid)
returns json as $$
declare
  result json;
  total_students int;
  avg_score numeric;
  max_score numeric;
  min_score numeric;
begin
  -- Refactored to use the pre-calculated 'average_score' in 'enrollments' table.
  
  select 
    count(*),
    coalesce(avg(average_score), 0),
    coalesce(max(average_score), 0),
    coalesce(min(average_score), 0)
  into 
    total_students,
    avg_score,
    max_score,
    min_score
  from enrollments
  where course_id = p_course_id;

  select json_build_object(
    'student_count', total_students,
    'average', round(avg_score, 2),
    'max_score', max_score,
    'min_score', min_score
  ) into result;

  return result;
end;
$$ language plpgsql;
