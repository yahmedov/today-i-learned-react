CREATE POLICY "Enable read access for all users" 
ON public.facts 
FOR SELECT 
TO public 
USING (true);

CREATE POLICY "Enable insert access for all users" 
ON public.facts 
FOR INSERT 
TO public 
WITH CHECK (true);

CREATE POLICY "Enable update access for all users" 
ON public.facts 
FOR UPDATE 
TO public 
USING (true) 
WITH CHECK (true);