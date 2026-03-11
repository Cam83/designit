"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { Checkbox } from "@/components/ui/checkbox"
import { Switch } from "@/components/ui/switch"
import { Slider } from "@/components/ui/slider"
import { Progress } from "@/components/ui/progress"
import { Skeleton } from "@/components/ui/skeleton"
import { Separator } from "@/components/ui/separator"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert"
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group"
import { Toggle } from "@/components/ui/toggle"
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion"
import { TooltipProvider, Tooltip, TooltipTrigger, TooltipContent } from "@/components/ui/tooltip"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import {
  Select, SelectContent, SelectItem, SelectTrigger, SelectValue,
} from "@/components/ui/select"
import {
  Breadcrumb, BreadcrumbItem, BreadcrumbLink, BreadcrumbList,
  BreadcrumbPage, BreadcrumbSeparator,
} from "@/components/ui/breadcrumb"
import { Label } from "@/components/ui/label"
import { Tag } from "@/components/ui/tag"
import { Info, AlertTriangle, CheckCircle, Terminal, Bold, Italic, Underline } from "lucide-react"

function Section({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <div className="mb-10">
      <h2 className="text-xs font-semibold uppercase tracking-widest text-muted-foreground mb-4">{title}</h2>
      <div className="flex flex-wrap items-start gap-3">{children}</div>
    </div>
  )
}

export default function ComponentsPage() {
  const [sliderVal, setSliderVal] = useState([40])
  const [checked, setChecked] = useState(true)
  const [switched, setSwitched] = useState(true)
  const [toggled, setToggled] = useState(false)

  return (
    <TooltipProvider>
      <div className="min-h-screen bg-background text-foreground">
        <div className="max-w-5xl mx-auto px-8 py-12">

          <div className="mb-10">
            <h1 className="text-2xl font-semibold mb-1">Components</h1>
            <p className="text-sm text-muted-foreground">Float UI components</p>
          </div>

          {/* Buttons */}
          <Section title="Button">
            <Button variant="default">Default</Button>
            <Button variant="secondary">Secondary</Button>
            <Button variant="outline">Outline</Button>
            <Button variant="ghost">Ghost</Button>
            <Button variant="destructive">Destructive</Button>
            <Button variant="link">Link</Button>
            <Button size="sm">Small</Button>
            <Button size="lg">Large</Button>
            <Button disabled>Disabled</Button>
          </Section>

          {/* Badge */}
          <Section title="Badge">
            <Badge>Default</Badge>
            <Badge variant="secondary">Secondary</Badge>
            <Badge variant="outline">Outline</Badge>
            <Badge variant="destructive">Destructive</Badge>
          </Section>

          {/* Avatar */}
          <Section title="Avatar">
            <Avatar>
              <AvatarImage src="https://hebbkx1anhila5yf.public.blob.vercel-storage.com/CR-avatar-Bz4EbF5HeVDJiGS7f3cWgRW6XtjgTN.jpeg" alt="CR Avatar" />
              <AvatarFallback>SC</AvatarFallback>
            </Avatar>
            <Avatar>
              <AvatarFallback>JD</AvatarFallback>
            </Avatar>
            <Avatar>
              <AvatarFallback>MH</AvatarFallback>
            </Avatar>
          </Section>

          {/* Input */}
          <Section title="Input &amp; Textarea">
            <div className="flex flex-col gap-2 w-64">
              <Input placeholder="Email address" type="email" />
              <Input placeholder="Disabled" disabled />
              <Textarea placeholder="Write something..." rows={3} />
            </div>
          </Section>

          {/* Select */}
          <Section title="Select">
            <Select>
              <SelectTrigger className="w-48">
                <SelectValue placeholder="Select a role" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="designer">Designer</SelectItem>
                <SelectItem value="developer">Developer</SelectItem>
                <SelectItem value="pm">Product Manager</SelectItem>
              </SelectContent>
            </Select>
          </Section>

          {/* Checkbox & Radio */}
          <Section title="Checkbox &amp; Radio">
            <div className="flex items-center gap-2">
              <Checkbox id="cb1" checked={checked} onCheckedChange={(v) => setChecked(!!v)} />
              <Label htmlFor="cb1">Accept terms</Label>
            </div>
            <RadioGroup defaultValue="option-1" className="flex gap-4">
              <div className="flex items-center gap-2">
                <RadioGroupItem value="option-1" id="r1" />
                <Label htmlFor="r1">Option 1</Label>
              </div>
              <div className="flex items-center gap-2">
                <RadioGroupItem value="option-2" id="r2" />
                <Label htmlFor="r2">Option 2</Label>
              </div>
            </RadioGroup>
          </Section>

          {/* Switch */}
          <Section title="Switch">
            <div className="flex items-center gap-2">
              <Switch id="sw1" checked={switched} onCheckedChange={setSwitched} />
              <Label htmlFor="sw1">{switched ? "On" : "Off"}</Label>
            </div>
          </Section>

          {/* Toggle */}
          <Section title="Toggle">
            <Toggle pressed={toggled} onPressedChange={setToggled}><Bold size={14} /></Toggle>
            <Toggle><Italic size={14} /></Toggle>
            <Toggle><Underline size={14} /></Toggle>
          </Section>

          {/* Slider */}
          <Section title="Slider">
            <div className="w-64">
              <Slider value={sliderVal} onValueChange={setSliderVal} max={100} step={1} />
              <p className="text-xs text-muted-foreground mt-2">{sliderVal[0]}%</p>
            </div>
          </Section>

          {/* Progress */}
          <Section title="Progress">
            <div className="w-64 flex flex-col gap-3">
              <Progress value={25} />
              <Progress value={50} />
              <Progress value={75} />
              <Progress value={100} />
            </div>
          </Section>

          {/* Skeleton */}
          <Section title="Skeleton">
            <div className="flex flex-col gap-2 w-64">
              <Skeleton className="h-4 w-full" />
              <Skeleton className="h-4 w-3/4" />
              <Skeleton className="h-4 w-1/2" />
              <Skeleton className="h-10 w-full rounded-md" />
            </div>
          </Section>

          {/* Separator */}
          <Section title="Separator">
            <div className="w-64 flex flex-col gap-3">
              <Separator />
              <div className="flex items-center gap-2">
                <span className="text-sm">Left</span>
                <Separator orientation="vertical" className="h-4" />
                <span className="text-sm">Right</span>
              </div>
            </div>
          </Section>

          {/* Tabs */}
          <Section title="Tabs">
            <Tabs defaultValue="tab1" className="w-80">
              <TabsList>
                <TabsTrigger value="tab1">Overview</TabsTrigger>
                <TabsTrigger value="tab2">Analytics</TabsTrigger>
                <TabsTrigger value="tab3">Settings</TabsTrigger>
              </TabsList>
              <TabsContent value="tab1"><p className="text-sm text-muted-foreground pt-2">Overview content.</p></TabsContent>
              <TabsContent value="tab2"><p className="text-sm text-muted-foreground pt-2">Analytics content.</p></TabsContent>
              <TabsContent value="tab3"><p className="text-sm text-muted-foreground pt-2">Settings content.</p></TabsContent>
            </Tabs>
          </Section>

          {/* Accordion */}
          <Section title="Accordion">
            <Accordion type="single" collapsible className="w-80">
              <AccordionItem value="a1">
                <AccordionTrigger>What is Float?</AccordionTrigger>
                <AccordionContent>Float is a resource management platform for creative agencies.</AccordionContent>
              </AccordionItem>
              <AccordionItem value="a2">
                <AccordionTrigger>How do I add people?</AccordionTrigger>
                <AccordionContent>Use the People section in the Data Hub to add employees and contractors.</AccordionContent>
              </AccordionItem>
            </Accordion>
          </Section>

          {/* Card */}
          <Section title="Card">
            <Card className="w-72">
              <CardHeader>
                <CardTitle>Campaign Q3</CardTitle>
                <CardDescription>Nike — Active project</CardDescription>
              </CardHeader>
              <CardContent>
                <p className="text-sm text-muted-foreground">Budget: $420,000 · 8 team members assigned.</p>
              </CardContent>
            </Card>
          </Section>

          {/* Alert */}
          <Section title="Alert">
            <div className="flex flex-col gap-3 w-80">
              <Alert>
                <Info size={14} />
                <AlertTitle>Info</AlertTitle>
                <AlertDescription>Your plan renews on April 1st.</AlertDescription>
              </Alert>
              <Alert variant="destructive">
                <AlertTriangle size={14} />
                <AlertTitle>Error</AlertTitle>
                <AlertDescription>Failed to save changes. Try again.</AlertDescription>
              </Alert>
            </div>
          </Section>

          {/* Tooltip */}
          <Section title="Tooltip">
            <Tooltip>
              <TooltipTrigger asChild>
                <Button variant="outline" size="sm">Hover me</Button>
              </TooltipTrigger>
              <TooltipContent>This is a tooltip</TooltipContent>
            </Tooltip>
          </Section>

          {/* Sidebar */}
          <Section title="Sidebar">
            <div className="rounded-xl overflow-hidden border" style={{ width: 260, height: 600, flexShrink: 0 }}>
              <iframe
                src="/"
                style={{ width: 1440, height: 600, border: "none", pointerEvents: "none" }}
                scrolling="no"
              />
            </div>
          </Section>

          {/* Table */}
          <Section title="Table">
            <div className="w-full max-w-lg border rounded-md overflow-hidden">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Name</TableHead>
                    <TableHead>Role</TableHead>
                    <TableHead>Status</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  <TableRow>
                    <TableCell>Michael Hitchcock</TableCell>
                    <TableCell>Designer</TableCell>
                    <TableCell><Badge variant="secondary">Active</Badge></TableCell>
                  </TableRow>
                  <TableRow>
                    <TableCell>Sara Chen</TableCell>
                    <TableCell>Developer</TableCell>
                    <TableCell><Badge variant="secondary">Active</Badge></TableCell>
                  </TableRow>
                  <TableRow>
                    <TableCell>Tom Briggs</TableCell>
                    <TableCell>PM</TableCell>
                    <TableCell><Badge variant="outline">Away</Badge></TableCell>
                  </TableRow>
                </TableBody>
              </Table>
            </div>
          </Section>

          {/* Tag */}
          <Section title="Tag">
            <Tag label="Acquisition" />
            <Tag label="Retention" />
          </Section>

          {/* Breadcrumb */}
          <Section title="Breadcrumb">
            <Breadcrumb>
              <BreadcrumbList>
                <BreadcrumbItem><BreadcrumbLink href="#">Global</BreadcrumbLink></BreadcrumbItem>
                <BreadcrumbSeparator />
                <BreadcrumbItem><BreadcrumbLink href="#">Data Hub</BreadcrumbLink></BreadcrumbItem>
                <BreadcrumbSeparator />
                <BreadcrumbItem><BreadcrumbPage>People</BreadcrumbPage></BreadcrumbItem>
              </BreadcrumbList>
            </Breadcrumb>
          </Section>

        </div>
      </div>
    </TooltipProvider>
  )
}
