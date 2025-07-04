"use client";
import React, { useState } from 'react'
import { BsFillSendPlusFill } from 'react-icons/bs';

const inquiries = [
  {
    property: 'Modern 2-bedroom apartment with pool access.',
    location: 'Lekki, Lagos',
    clients: [
      {
        id: 1,
        name: 'Jane Doe',
        email: 'jane.doe@email.com',
        avatar: 'https://randomuser.me/api/portraits/women/44.jpg',
        status: 'pending',
      },
      {
        id: 2,
        name: 'John Smith',
        email: 'john.smith@email.com',
        avatar: 'https://randomuser.me/api/portraits/men/32.jpg',
        status: 'pending',
      },
    ],
  },
  {
    property: 'Luxury 4-bedroom penthouse with sea view.',
    location: 'Victoria Island, Lagos',
    clients: [
      {
        id: 3,
        name: 'Mike Smith',
        email: 'mike.smith@email.com',
        avatar: 'https://randomuser.me/api/portraits/men/65.jpg',
        status: 'pending',
      },
      // {
      //   id: 4,
      //   name: 'Sarah Lee',
      //   email: 'sarah.lee@email.com',
      //   avatar: 'https://randomuser.me/api/portraits/women/45.jpg',
      //   status: 'pending',
      // },
    ],
  },
  {
    property: 'Affordable mini-flat close to UNILAG.',
    location: 'Yaba, Lagos',
    clients: [
      {
        id: 5,
        name: 'Ada Obi',
        email: 'ada.obi@email.com',
        avatar: 'https://randomuser.me/api/portraits/women/68.jpg',
        status: 'pending',
      },
      {
        id: 6,
        name: 'Chinedu Okafor',
        email: 'chinedu.okafor@email.com',
        avatar: 'https://randomuser.me/api/portraits/men/77.jpg',
        status: 'pending',
      },
    ],
  },
];

export default function Inquiries() {
  const [requests, setRequests] = useState(inquiries);
  const [search, setSearch] = useState('');
  const [modalImg, setModalImg] = useState<string | null>(null);

  const handleApprove = (propertyIdx: number, clientId: number) => {
    setRequests(reqs =>
      reqs.map((prop, idx) =>
        idx === propertyIdx
          ? {
              ...prop,
              clients: prop.clients.map(client =>
                client.id === clientId ? { ...client, status: 'approved' } : client
              ),
            }
          : prop
      )
    );
  };

  const filteredRequests = requests.filter(prop =>
    prop.property.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <section>
     <div className='flex not-sm:flex-col justify-between sm:items-center'>
       <h2 className="text-2xl font-bold mb-6">Client Inquiries</h2>
        <input
          type="search"
          value={search}
          onChange={e => setSearch(e.target.value)}
          placeholder="Search by property"
          className="border-2 border-gray-300 rounded-xl p-2 w-full sm:w-1/2 mb-8 focus:ring-2 focus:ring-sky-700 focus:border-sky-700 transition outline-none bg-gray-50 placeholder-gray-400"
        />
     </div>

      <div className="space-y-10 flex flex-wrap gap-5 mt-10">
        {filteredRequests.map((prop, propIdx) => (
          <div key={prop.property} className="bg-gray-50 rounded-xl shadow p-5 w-full sm:w-[48%] relative">
            <div className='h-16 w-16  font-semibold  text-3xl bg-gray-100 rounded-full flex items-center justify-center absolute -top-[10%] shadow-xl shadow-gray-300'>{propIdx+1}</div>
            <div className="mb-4 mt-5">
              <div className="font-semibold text-lg">{prop.property}</div>
              <div className="text-xs text-gray-500">{prop.location}</div>
              <div className='text-xs text-gray-600 font-semibold'>Total Clients: {prop.clients.length}</div>
            </div>
            <div className="space-y-4">
              {prop.clients.map(client => (
                <div
                  key={client.id}
                  className="flex flex-col sm:flex-row sm:items-center justify-between bg-white rounded-lg shadow-sm p-3 gap-4"
                >
                  <div
                    className="flex items-center gap-4 cursor-pointer"
                    onClick={() => setModalImg(client.avatar)}
                    title="Click to view profile picture"
                  >
                    <img
                      src={client.avatar}
                      alt={client.name}
                      className="w-12 h-12 rounded-full object-cover border"
                    />
                    <div>
                      <div className="font-semibold">{client.name}</div>
                      <div className="text-xs text-gray-500">{client.email}</div>
                    </div>
                  </div>
                  <div className='space-x-3 flex items-center'>
                    {client.status === 'pending' ? (
                    <>
                         <button
                            className="px-4 py-2 bg-sky-700 text-white border-2 border-sky-700 not-sm:text-xs rounded hover:bg-sky-800 transition"
                            onClick={() => handleApprove(propIdx, client.id)}
                          >
                            Approve
                          </button>

                          <button title='Click to send a message' className="px-4 py-2 bg-white border-2 text-xl border-sky-700 text-gray-700 not-sm:text-xs rounded hover:bg-gray-300 transition">
                            <BsFillSendPlusFill />
                          </button>
                    </>
                    ) : (
                      <span className="px-4 py-2 bg-green-100 text-green-700 rounded font-semibold">
                        Approved
                      </span>
                    )}
                  </div>
                </div>
              ))}
            </div>
          </div>
        ))}
      </div>
      {modalImg && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center bg-black/80"
          onClick={() => setModalImg(null)}
        >
          <div className="relative w-[90vw] max-w-xs h-[90vw] max-h-[400px]">
            <img
              src={modalImg}
              alt="Profile"
              className="object-contain w-full h-full rounded-lg shadow-2xl bg-white"
              onClick={e => e.stopPropagation()}
            />
            <button
              className="absolute top-2 right-2 bg-white/80 rounded-full px-3 py-1 text-black font-bold text-lg"
              onClick={() => setModalImg(null)}
            >
              ×
            </button>
          </div>
        </div>
      )}
    </section>
  );
}