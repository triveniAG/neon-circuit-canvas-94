-- Create table for circuit component definitions
CREATE TABLE public.circuit_components (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  name TEXT NOT NULL UNIQUE,
  symbol TEXT,
  definition TEXT NOT NULL,
  application TEXT NOT NULL,
  why_used TEXT NOT NULL,
  image_url TEXT,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Enable RLS (public read access for component library)
ALTER TABLE public.circuit_components ENABLE ROW LEVEL SECURITY;

-- Allow anyone to read component definitions
CREATE POLICY "Anyone can read circuit components"
ON public.circuit_components
FOR SELECT
USING (true);

-- Create table for storing scan results (for logged in users later)
CREATE TABLE public.scan_results (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  image_url TEXT,
  detected_components JSONB NOT NULL DEFAULT '[]',
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Enable RLS
ALTER TABLE public.scan_results ENABLE ROW LEVEL SECURITY;

-- Allow anyone to insert scan results (no auth required for MVP)
CREATE POLICY "Anyone can create scan results"
ON public.scan_results
FOR INSERT
WITH CHECK (true);

-- Allow anyone to read scan results
CREATE POLICY "Anyone can read scan results"
ON public.scan_results
FOR SELECT
USING (true);

-- Seed initial component data
INSERT INTO public.circuit_components (name, symbol, definition, application, why_used) VALUES
('Resistor', 'R', 'A passive component that resists the flow of electric current, converting electrical energy into heat.', 'Current limiting, voltage division, pull-up/pull-down circuits, LED protection, signal conditioning.', 'Controls current flow and drops voltage to protect other components from damage.'),
('Capacitor', 'C', 'A component that stores electrical energy in an electric field between two conductive plates separated by a dielectric.', 'Filtering, coupling, decoupling, timing circuits, power supply smoothing, energy storage.', 'Provides temporary energy storage, filters noise, and stabilizes voltage in circuits.'),
('Transistor', 'Q', 'A semiconductor device used to amplify or switch electronic signals and electrical power.', 'Amplification, switching, signal modulation, logic gates, voltage regulation.', 'Acts as an electronic switch or amplifier, forming the basis of modern electronics.'),
('Diode', 'D', 'A semiconductor device that allows current to flow in one direction only, acting as a one-way valve.', 'Rectification, voltage clamping, signal demodulation, protection against reverse polarity.', 'Converts AC to DC and protects circuits from reverse current damage.'),
('LED', 'LED', 'A Light Emitting Diode that produces light when current flows through it in the forward direction.', 'Status indicators, displays, lighting, optical communication, backlighting.', 'Provides visual feedback and efficient lighting with low power consumption.'),
('Inductor', 'L', 'A passive component that stores energy in a magnetic field when electric current flows through it.', 'Filtering, energy storage in power supplies, tuned circuits, electromagnetic interference suppression.', 'Resists changes in current, filters high-frequency noise, and stores magnetic energy.'),
('Integrated Circuit', 'IC', 'A miniaturized electronic circuit containing transistors, resistors, and capacitors fabricated on a semiconductor substrate.', 'Microprocessors, memory chips, amplifiers, voltage regulators, timers, logic controllers.', 'Combines multiple components into a compact package for complex functionality.'),
('Transformer', 'T', 'A device that transfers electrical energy between circuits through electromagnetic induction, changing voltage levels.', 'Power supply voltage conversion, isolation, impedance matching, signal coupling.', 'Steps voltage up or down efficiently and provides electrical isolation between circuits.'),
('Relay', 'K', 'An electrically operated switch that uses an electromagnet to mechanically control a circuit.', 'Switching high-power loads, isolation, automotive systems, industrial control.', 'Allows low-power signals to control high-power circuits safely.'),
('Crystal Oscillator', 'Y', 'A piezoelectric component that generates a precise frequency signal using mechanical resonance of a vibrating crystal.', 'Clock generation, timing circuits, radio transmitters, microcontroller timing.', 'Provides stable and accurate frequency reference for digital circuits.'),
('Fuse', 'F', 'A safety device that protects circuits by melting and breaking the circuit when current exceeds a safe level.', 'Overcurrent protection, circuit breakers, safety systems.', 'Prevents fire and damage by interrupting excessive current flow.'),
('Voltage Regulator', 'VR', 'A circuit or device that maintains a constant output voltage regardless of input voltage or load changes.', 'Power supplies, battery-powered devices, sensitive electronic equipment.', 'Ensures stable voltage for reliable operation of electronic components.');