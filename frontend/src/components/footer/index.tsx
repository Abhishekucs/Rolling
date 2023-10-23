import React from "react";
import Logo from "../logo";
import Link from "next/link";
import { Instagram, Whatsapp } from "../icons";

const navigation = {
  name: "Navigation",
  items: [
    {
      name: "home",
      route: "/",
    },
    {
      name: "catalog",
      route: "/catalog",
    },
    {
      name: "about us",
      route: "/about",
    },
  ],
};
const extra = {
  name: "Extra",
  items: [
    {
      name: "track order",
      route: "https://www.shiprocket.com",
    },
    {
      name: "return order",
      route: "/return",
    },
    {
      name: "privacy policy",
      route: "/privacy",
    },
    {
      name: "terms & conditions",
      route: "/terms&conditions",
    },
  ],
};

const links = [navigation, extra];

const contacts = [
  {
    id: 1,
    label: "email",
    value: "abhishekucskumar@gmail.com",
    route: "mailto:abhishekucskumar?subject=Get To Know You",
  },
  {
    id: 2,
    label: "address",
    value:
      "ashok vihar colony, bypass road, near sanket narayan, gaya, bihar 823001",
    route: "https://maps.app.goo.gl/mAthEhaoZc97TrH48",
  },
  {
    id: 3,
    label: "mobile number",
    value: "9955416457",
    route: "tel:+919955416457",
  },
  {
    id: 4,
    label: "social",
    value: [
      {
        component: <Whatsapp className="text-brown-200 fill-current" />,
        route: "https://www.instagram.com/rollingcloth/",
      },
      {
        component: <Instagram className="text-brown-200 fill-current" />,
        route: "https://www.instagram.com/rollingcloth/",
      },
    ],
  },
];

export const Footer = (): JSX.Element => {
  return (
    <div className="w-screen">
      <div className="bg-brown-400 flex flex-col-reverse sm:flex-row base-layout pt-14 sm:pt-40 pb-14 justify-between">
        <LogoAndLinks />
        <Contact />
      </div>
      <CopyRight />
    </div>
  );
};

function Contact(): JSX.Element {
  return (
    <div className="flex flex-col gap-y-10 sm:gap-y-20 max-sm:pb-10 sm:-mt-10">
      <div className="flex gap-x-4 max-sm:items-center">
        <span className="uppercase text-brown-200 font-[400] text-5xl md:text-6xl lg:text-7xl xl:text-8xl">
          get
        </span>
        <span className="uppercase text-brown-400 text-shadow font-[400] text-5xl md:text-6xl lg:text-7xl xl:text-8xl">
          in touch
        </span>
      </div>
      <div className="flex flex-col">
        {contacts.map((contact) => (
          <div
            className="border-t-[1px] border-brown-200/20 flex pt-4 pb-7 gap-x-10"
            key={contact.id}
          >
            <div>
              <span className="text-brown-200 font-[200] text-sm">{`0${contact.id}`}</span>
            </div>
            <div className="flex flex-col">
              <span className="text-brown-200/20 font-[200] capitalize text-sm pb-2">
                {contact.label}
              </span>
              {contact.label.toString().toLowerCase() === "social" ? (
                <div className="flex gap-x-3">
                  {Array.isArray(contact.value)
                    ? [...contact.value].map((icon, index) => {
                        return (
                          <div key={index}>
                            <Link
                              href={icon.route}
                              target="_blank"
                              rel="noopener noreferrer"
                            >
                              {icon.component}
                            </Link>
                          </div>
                        );
                      })
                    : null}
                </div>
              ) : typeof contact.value === "string" ? (
                <div className="max-w-[60%]">
                  <Link
                    href={contact.route as string}
                    target={
                      contact.label.toLowerCase() === "address"
                        ? "_blank"
                        : "_parent"
                    }
                    rel="noopener noreferrer"
                  >
                    <span className="text-brown-200 font-[200] underline decoration-dotted underline-offset-4">
                      {contact.value}
                    </span>
                  </Link>
                </div>
              ) : null}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

function LogoAndLinks(): JSX.Element {
  return (
    <div className="flex flex-col items-start gap-y-20">
      <div className="hidden sm:block">
        <Logo className="text-brown-200 w-[15vh]" />
      </div>
      <div className="flex w-full justify-between gap-x-16">
        {links.map((link, index) => {
          return (
            <div className="flex flex-col gap-y-3 sm:gap-y-5" key={index}>
              <div>
                <h2 className="font-[100] text-xs sm:text-sm text-brown-200/50">
                  {link.name}
                </h2>
              </div>
              <div>
                <ul>
                  {link.items.map((item, index) => (
                    <li
                      key={index}
                      className="uppercase text-brown-200 underline font-[200] text-sm underline-offset-2 sm:text-base even:py-2 sm:even:py-1"
                    >
                      <Link href={item.route}>{item.name}</Link>
                    </li>
                  ))}
                </ul>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}

function CopyRight(): JSX.Element {
  return (
    <div className="bg-brown-500 flex justify-center items-center py-3">
      <p className="font-[100] text-xs text-brown-200/50">
        Copyright &copy; Rolling. All Right Reserved
      </p>
    </div>
  );
}
