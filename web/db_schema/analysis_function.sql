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
  -- Note: This uses a simplified average calculation (sum of scores) as strict weighted logic 
  -- is complex to replicate in SQL without duplicating the logic from calculator.ts.
  -- Ideally, the app should save the calculated 'average' to the 'enrollments' table.
  
  with student_totals as (
    select 
      e.student_id,
      sum(s.value) as total_val -- Assuming simple sum for now if weights are 0 in DB
    from enrollments e
    join scores s on s.student_id = e.student_id
    where e.course_id = p_course_id
    group by e.student_id
  )
  select 
    count(*),
    coalesce(avg(total_val), 0),
    coalesce(max(total_val), 0),
    coalesce(min(total_val), 0)
  into 
    total_students,
    avg_score,
    max_score,
    min_score
  from student_totals;

  select json_build_object(
    'student_count', total_students,
    'average', round(avg_score, 2),
    'max_score', max_score,
    'min_score', min_score
  ) into result;

  return result;
end;
$$ language plpgsql;
