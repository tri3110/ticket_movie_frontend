import { useState } from "react"
import { Combobox, ComboboxButton, ComboboxInput, ComboboxOption, ComboboxOptions } from '@headlessui/react'
import { ChevronDownIcon, MapPinIcon } from "@heroicons/react/20/solid"

interface Person
{
    id: number; 
    name: string 
}

const people = [
  { id: 1, name: 'Durward Reynolds' },
  { id: 2, name: 'Kenton Towne' },
  { id: 3, name: 'Therese Wunsch' },
  { id: 4, name: 'Benedict Kessler' },
  { id: 5, name: 'Katelyn Rohan' },
]

export default function AppMovieSchedule () {
    const [selectedPerson, setSelectedPerson] = useState<Person | null>(people[0])
    const [query, setQuery] = useState('')

    const filteredPeople =
        query === ''
        ? people
        : people.filter((person) => {
            return person.name.toLowerCase().includes(query.toLowerCase())
        })

    return (
        <div className="md:shadow-soju1 rounded-lg border-gray-200 bg-white md:overflow-hidden md:border h-[500px]">
            <div className="flex items-center py-3 md:px-4 gap-4 border-b border-gray-200">
                <label className="text-sm">Vị trí</label>
                <Combobox value={selectedPerson} onChange={setSelectedPerson}>
                    <div className="relative w-60">
                        <div className="relative w-full">
                            <div className="absolute inset-y-0 left-1 flex items-center pr-2">
                                <MapPinIcon className="w-5 h-5 text-red-400" 
                                style={{
                                    paddingBottom : "2px"
                                }} aria-hidden="true" />
                            </div>
                            <ComboboxInput
                                displayValue={(person: Person | null) => person?.name ?? ''}
                                onChange={(event) => setQuery(event.target.value)}
                                className="w-full pl-8 pr-3 py-2 pr-10 border border-red-500 rounded-md focus:outline-none "
                            />
                            <ComboboxButton className="absolute inset-y-0 right-0 flex items-center pr-2">
                                <ChevronDownIcon className="w-5 h-5 text-gray-400" aria-hidden="true" />
                            </ComboboxButton>
                        </div>

                        <ComboboxOptions className="absolute z-10 mt-1 max-h-60 w-full overflow-auto rounded-md bg-white py-1 text-sm shadow-lg ring-1 ring-black ring-opacity-5">
                        {
                            filteredPeople.length === 0 ? (
                                <div className="px-3 py-2 text-gray-500">Không có kết quả</div>
                            ) : (
                                filteredPeople.map((person) => (
                                <ComboboxOption
                                    key={person.id}
                                    value={person}
                                    className={({ active }) =>
                                    `cursor-pointer px-4 py-2 ${
                                        active ? 'bg-blue-500 text-white' : ''
                                    }`
                                    }
                                >
                                    {person.name}
                                </ComboboxOption>
                                ))
                            )
                        }
                        </ComboboxOptions>
                    </div>
                </Combobox>
            </div>
        </div>
    )
}