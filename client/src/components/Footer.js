const Footer = () => {
  return (
    <footer>
      <a
        href="https://github.com/ExileAS/full-stack-e-commrece/tree/production"
        className="github"
      >
        <h2>Project GitHub Repo</h2>
      </a>
      <br />
      <h2>
        &copy; {new Date().getFullYear()} Ahmed Samy. All rights reserved.
      </h2>
    </footer>
  );
};

export default Footer;
