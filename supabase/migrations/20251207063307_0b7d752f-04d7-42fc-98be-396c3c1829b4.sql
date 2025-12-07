-- Add new columns for enhanced component information
ALTER TABLE public.circuit_components
ADD COLUMN category text,
ADD COLUMN circuit_diagram_svg text,
ADD COLUMN specifications jsonb DEFAULT '{}'::jsonb,
ADD COLUMN common_values text[];