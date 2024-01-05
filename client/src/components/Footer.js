const Footer = () => {
  return (
    <footer>
      <h3>
        <a
          href="https://github.com/ExileAS/full-stack-e-commrece"
          className="github"
        >
          Project GitHub Repo
        </a>
      </h3>
      <h2>
        &copy; {new Date().getFullYear()} Ahmed Samy. All rights reserved.
      </h2>
    </footer>
  );
};

export default Footer;
